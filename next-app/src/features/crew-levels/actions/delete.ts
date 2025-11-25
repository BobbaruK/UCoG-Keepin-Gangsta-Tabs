"use server";

import { MESSAGES_FN } from "@/constants/messages";
import { crewLevelsTitle } from "@/constants/page-title/crew-levels";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { headers } from "next/headers";

const UNAUTHORIZE = MESSAGES_FN({
  resource: crewLevelsTitle.label.singular.toLowerCase(),
}).RESOURCE_DELETE_UNAUTHORIZED;

export const deleteCrewLevel = async (
  resourceId: string,
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
  const dataSession = await auth.api.getSession({
    headers: await headers(),
  });

  if (!dataSession) {
    return {
      error: UNAUTHORIZE,
    };
  }

  const data = await auth.api.userHasPermission({
    body: {
      userId: dataSession.user.id,
      role: dataSession.user.role as UserRole,
      permission: { crew_levels: ["delete"] },
    },
  });

  if (!data.success)
    return {
      error: UNAUTHORIZE,
    };

  try {
    const level = await db.cog_crew_level.delete({
      where: { id: resourceId },
    });

    return {
      success: MESSAGES_FN({
        resource: crewLevelsTitle.label.singular.toLowerCase() + "(s)",
        resourceName: level.name,
      }).RESOURCE_DELETE_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
