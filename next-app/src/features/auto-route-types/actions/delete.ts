"use server";

import { MESSAGES_FN } from "@/constants/messages";
import { autoRouteTypesTitle } from "@/constants/page-title/auto-route-types";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { headers } from "next/headers";

const UNAUTHORIZED = MESSAGES_FN({
  resource: autoRouteTypesTitle.label.plural.toLowerCase(),
}).RESOURCE_DELETE_UNAUTHORIZED;

export const deleteAutoRouteType = async (
  id: string,
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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      error: UNAUTHORIZED,
    };
  }

  const permissions = await auth.api.userHasPermission({
    body: {
      userId: session.user.id,
      role: session.user.role as UserRole,
      permission: { auto_route_types: ["delete"] },
    },
  });

  if (!permissions.success)
    return {
      error: UNAUTHORIZED,
    };

  try {
    const routeType = await db.cog_auto_route_type.delete({
      where: { id },
    });

    return {
      success: MESSAGES_FN({
        resource: autoRouteTypesTitle.label.singular.toLowerCase(),
        resourceName: routeType.name,
      }).RESOURCE_DELETE_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
