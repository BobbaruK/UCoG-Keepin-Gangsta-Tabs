"use server";

import { MESSAGES_FN } from "@/constants/messages";
import { captainRolesTitle } from "@/constants/page-title/captain-roles";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { headers } from "next/headers";

const UNAUTHORIZED = MESSAGES_FN({
  resource: captainRolesTitle.label.plural.toLowerCase(),
}).RESOURCE_DELETE_UNAUTHORIZED;

export const deleteCaptainRole = async (
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
      error: UNAUTHORIZED,
    };
  }

  const data = await auth.api.userHasPermission({
    body: {
      userId: dataSession.user.id,
      role: dataSession.user.role as UserRole,
      permission: { captain_roles: ["delete"] },
    },
  });

  if (!data.success)
    return {
      error: UNAUTHORIZED,
    };

  try {
    const captainRole = await db.cog_captain_role.delete({
      where: { id: resourceId },
    });

    return {
      success: MESSAGES_FN({
        resource: captainRolesTitle.label.singular.toLowerCase(),
        resourceName: captainRole.name,
      }).RESOURCE_DELETE_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
