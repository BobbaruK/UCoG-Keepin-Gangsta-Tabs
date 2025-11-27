"use server";

import { MESSAGES, MESSAGES_FN } from "@/constants/messages";
import { crewMembersTitle } from "@/constants/page-title/crew-members";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { Playthrough } from "@/core/db/playthrough/types/playthrough";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { catchError } from "@/lib/utils/catch-error-action";
import { setFullName } from "@/lib/utils/full-name";
import { headers } from "next/headers";
import z from "zod";
import { AddCrewMemberSchema } from "../../schemas/add";

const UNAUTHORIZED = MESSAGES_FN({
  resource: crewMembersTitle.label.singular.toLowerCase(),
}).RESOURCE_CREATE_UNAUTHORIZED;

export const addCrewMember = async ({
  playthrough,
  values,
}: {
  playthrough: Playthrough;
  values: z.infer<typeof AddCrewMemberSchema>;
}): Promise<
  | {
      error: string;
      success?: undefined;
      crewMemberId?: undefined;
    }
  | {
      success: string;
      crewMemberId: string;
      error?: undefined;
    }
> => {
  const validatedFields = AddCrewMemberSchema.safeParse(values);

  if (!validatedFields.success) return { error: MESSAGES.INVALID_FIELDS };

  const {
    first_name,
    last_name,
    alias,
    turn_recruited,
    captain_role,
    isDead,
    nationality,
    traits,
  } = validatedFields.data;

  if (traits.length > 3) {
    return {
      error: MESSAGES.TRAITS_TOO_MANY,
    };
  }

  const dataSession = await auth.api.getSession({
    headers: await headers(),
  });

  if (!dataSession) {
    return {
      error: UNAUTHORIZED,
    };
  }

  const data = await auth.api.userHasPermission({
    body: {
      userId: dataSession.user.id,
      role: dataSession.user.role as UserRole,
      permission: { crew_member: ["create"] },
    },
  });

  if (!data.success)
    return {
      error: UNAUTHORIZED,
    };

  if (playthrough.auth_userId !== dataSession.user.id)
    return {
      error: MESSAGES_FN({
        resource: playthroughTitle.label.singular.toLowerCase(),
      }).RESOURCE_CREATE_UNAUTHORIZED_OTHER,
    };

  if (playthrough.is_finished)
    return {
      error: `You cannot add data to a finished ${playthroughTitle.label.singular.toLowerCase()}.`,
    };

  try {
    const member = await db.cog_crew_member.create({
      data: {
        first_name: first_name || "Noname",
        last_name: last_name || "Noname",
        full_name: setFullName({
          firstName: first_name || "Noname",
          lastName: last_name || "Noname",
          alias: alias || null,
        }).outputDB,
        alias: alias || null,
        turn_recruited,
        cog_captain_roleId: captain_role || null,
        is_dead: isDead,
        cog_nationalityId: nationality,
        traits: {
          connect: traits.map((trait) => ({ id: trait })),
        },
        is_boss: false,
        auth_userId: dataSession.user.id,
        cog_playthroughId: playthrough.id,
      },
    });

    return {
      success: MESSAGES_FN({
        resource: crewMembersTitle.label.singular.toLowerCase(),
        resourceName: member.full_name,
      }).RESOURCE_CREATE_SUCCESS,
      crewMemberId: member.id,
    };
  } catch (error) {
    return catchError(error);
  }
};
