"use server";

import { MESSAGES, MESSAGES_FN } from "@/constants/messages";
import { crewMembersTitle } from "@/constants/page-title/crew-members";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { headers } from "next/headers";
import z from "zod";
import { AddCrewMemberSchema } from "../../schemas/add";
import { setFullName } from "../../utils/full-name";

export const editCrewMember = async ({
  playthroughId,
  memberId,
  values,
}: {
  playthroughId: string;
  memberId: string;
  values: z.infer<typeof AddCrewMemberSchema>;
}): Promise<
  | {
      error: string;
      success?: undefined;
    }
  | {
      success: string;
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
      error: MESSAGES_FN({
        resource: crewMembersTitle.label.singular.toLowerCase() + "(s)",
      }).RESOURCE_CREATE_UNAUTHORIZED,
    };
  }

  const data = await auth.api.userHasPermission({
    body: {
      userId: dataSession.user.id,
      role: dataSession.user.role as UserRole,
      permission: { crew_member: ["update"] },
    },
  });

  if (!data.success)
    return {
      error: MESSAGES_FN({
        resource: crewMembersTitle.label.singular.toLowerCase() + "(s)",
      }).RESOURCE_CREATE_UNAUTHORIZED,
    };

  try {
    const member = await db.cog_crew_member.update({
      where: {
        id: memberId,
      },
      data: {
        first_name,
        last_name,
        full_name: setFullName({
          firstName: first_name,
          lastName: last_name,
          alias: alias,
        }).outputDB,
        alias: alias || null,
        turn_recruited,
        cog_captain_roleId: captain_role || null,
        is_dead: isDead,
        cog_nationalityId: nationality,
        traits: {
          set: traits.map((trait) => ({ id: trait })),
        },
        auth_userId: dataSession.user.id,
        cog_playthroughId: playthroughId,
      },
    });

    return {
      success: MESSAGES_FN({
        resource: crewMembersTitle.label.singular.toLowerCase(),
        resourceName: setFullName({
          firstName: member.first_name,
          lastName: member.last_name,
          alias: member.alias,
        }).outputFE,
      }).RESOURCE_EDIT_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
