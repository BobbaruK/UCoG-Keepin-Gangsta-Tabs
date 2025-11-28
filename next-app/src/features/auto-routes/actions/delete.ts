"use server";

import { MESSAGES_FN } from "@/constants/messages";
import { autoRoutesTitle } from "@/constants/page-title/auto-routes";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { AutoRoute } from "@/core/cog/auto-route/types/auto-route";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { headers } from "next/headers";

const UNAUTHORIZED = MESSAGES_FN({
  resource: autoRoutesTitle.label.singular.toLowerCase() + "(s)",
}).RESOURCE_DELETE_UNAUTHORIZED;

export const deleteAutoRoute = async (
  autoRoute: AutoRoute,
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
      permissions: { police_officers: ["delete"] },
    },
  });

  if (!permissions.success)
    return {
      error: UNAUTHORIZED,
    };

  if (autoRoute.auth_userId !== session.user.id)
    return {
      error: MESSAGES_FN({
        resource: autoRoutesTitle.label.singular.toLowerCase() + "(s)",
      }).RESOURCE_DELETE_UNAUTHORIZED_OTHER,
    };

  if (autoRoute.playthrough.is_finished)
    return {
      error: `You cannot delete data from a finished ${playthroughTitle.label.singular.toLowerCase()}.`,
    };

  try {
    const data = await db.cog_auto_route.delete({
      where: { id: autoRoute.id },
    });

    return {
      success: MESSAGES_FN({
        resource: autoRoutesTitle.label.singular.toLowerCase() + "(s)",
        resourceName: data.name,
      }).RESOURCE_DELETE_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
