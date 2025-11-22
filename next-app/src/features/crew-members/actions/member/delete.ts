"use server";

import { MESSAGES_FN } from "@/constants/messages";
import { crewMembersTitle } from "@/constants/page-title/crew-members";
import { CrewMember } from "@/core/db/crew-member/types/crew-member";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { headers } from "next/headers";

export const deleteCrewMember = async (
  crewMember: CrewMember,
): Promise<
  | {
      error: string;
      success?: undefined;
    }
  | {
      success: string;
      error?: undefined;
    }
> => {
  if (crewMember.is_boss) {
    return {
      error: "You cannot delete the BOSS.",
    };
  }

  const dataSession = await auth.api.getSession({
    headers: await headers(),
  });

  if (!dataSession) {
    return {
      error: MESSAGES_FN({
        resource: crewMembersTitle.label.singular.toLowerCase() + "(s)",
      }).RESOURCE_DELETE_UNAUTHORIZED,
    };
  }

  const data = await auth.api.userHasPermission({
    body: {
      userId: dataSession.user.id,
      role: dataSession.user.role as UserRole,
      permission: { crew_member: ["delete"] },
    },
  });

  if (!data.success)
    return {
      error: MESSAGES_FN({
        resource: crewMembersTitle.label.singular.toLowerCase() + "(s)",
      }).RESOURCE_DELETE_UNAUTHORIZED,
    };

  try {
    const member = await db.cog_crew_member.delete({
      where: { id: crewMember.id },
    });

    return {
      success: MESSAGES_FN({
        resource: crewMembersTitle.label.singular.toLowerCase() + "(s)",
        resourceName: `${member.first_name} ${member.alias ? `"${member.alias}"` : ""}  ${member.last_name}`,
      }).RESOURCE_DELETE_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
