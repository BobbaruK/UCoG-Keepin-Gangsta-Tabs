"use server";

import { MESSAGES, MESSAGES_FN } from "@/constants/messages";
import { crewMembersTitle } from "@/constants/page-title/crew-members";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { setFullName } from "@/lib/utils/full-name";
import { headers } from "next/headers";
import z from "zod";
import { AddCrewMemberSchema } from "../../schemas/add";

const UNAUTHORIZED = MESSAGES_FN({
  resource: crewMembersTitle.label.singular.toLowerCase(),
}).RESOURCE_EDIT_UNAUTHORIZED;

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
      error: UNAUTHORIZED,
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
      error: UNAUTHORIZED,
    };

  const existingMember = await db.cog_crew_member.findUnique({
    where: { id: memberId },
  });

  if (!existingMember)
    return {
      error: MESSAGES_FN({
        resource: crewMembersTitle.label.singular.toLowerCase() + "(s)",
      }).RESOURCE_NOT_EXISTS,
    };

  try {
    if (existingMember.is_boss && isDead) {
      const member = await editMember({
        userId: dataSession.user.id,
        playthroughId: playthroughId,
        memberId: memberId,
        first_name,
        last_name,
        alias,
        turn_recruited,
        captain_role,
        isDead,
        nationality,
        traits,
      });

      const playthrough = await db.cog_playthrough.update({
        where: {
          id: playthroughId,
        },
        data: {
          is_finished: true,
        },
      });

      return {
        success: MESSAGES_FN({
          resource: crewMembersTitle.label.singular.toLowerCase(),
          resourceName: `${
            setFullName({
              firstName: member.first_name,
              lastName: member.last_name,
              alias: member.alias,
            }).outputFE
          } (dead) and ${playthrough.name} (finished)`,
        }).RESOURCE_EDIT_SUCCESS,
      };
    }

    const member = await editMember({
      userId: dataSession.user.id,
      playthroughId: playthroughId,
      memberId: memberId,
      first_name,
      last_name,
      alias,
      turn_recruited,
      captain_role,
      isDead,
      nationality,
      traits,
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

async function editMember({
  memberId,
  userId,
  playthroughId,
  first_name,
  last_name,
  alias,
  turn_recruited,
  captain_role,
  isDead,
  nationality,
  traits,
}: z.infer<typeof AddCrewMemberSchema> & {
  memberId: string;
  userId: string;
  playthroughId: string;
}) {
  return db.cog_crew_member.update({
    where: {
      id: memberId,
    },
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
        set: traits.map((trait) => ({ id: trait })),
      },
      auth_userId: userId,
      cog_playthroughId: playthroughId,
    },
  });
}
