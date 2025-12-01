"use server";

import { MESSAGES_FN } from "@/constants/messages";
import { buildingTitle } from "@/constants/page-title/building";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { Building } from "@/core/cog/building/types/building";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { headers } from "next/headers";

const UNAUTHORIZED = MESSAGES_FN({
  resource: buildingTitle.label.singular.toLowerCase() + "(s)",
}).RESOURCE_DELETE_UNAUTHORIZED;

export const deleteBuilding = async (
  building: Building,
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
      permissions: { building: ["delete"] },
    },
  });

  if (!permissions.success)
    return {
      error: UNAUTHORIZED,
    };

  if (building.user_id !== session.user.id)
    return {
      error: MESSAGES_FN({
        resource: buildingTitle.label.singular.toLowerCase() + "(s)",
      }).RESOURCE_DELETE_UNAUTHORIZED_OTHER,
    };

  if (building.playthrough.is_finished)
    return {
      error: `You cannot delete data from a finished ${playthroughTitle.label.singular.toLowerCase()}.`,
    };

  try {
    const data = await db.cog_building.delete({
      where: { id: building.id },
    });

    return {
      success: MESSAGES_FN({
        resource: buildingTitle.label.singular.toLowerCase() + "(s)",
        resourceName: data.name,
      }).RESOURCE_DELETE_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
