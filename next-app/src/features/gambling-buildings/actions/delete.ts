"use server";

import { MESSAGES_FN } from "@/constants/messages";
import { gamblingBuildingsTitle } from "@/constants/page-title/gambling-buildings";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { gamblingBuildingInclude } from "@/core/cog/gambling-building/constants/include";
import { GamblingBuilding } from "@/core/cog/gambling-building/types/gambling-building";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { headers } from "next/headers";

const UNAUTHORIZED = MESSAGES_FN({
  resource: gamblingBuildingsTitle.label.singular.toLowerCase() + "(s)",
}).RESOURCE_DELETE_UNAUTHORIZED;

export const deleteGamblingBuilding = async (
  gamblingBuilding: GamblingBuilding,
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
      permissions: { gambling_building: ["delete"] },
    },
  });

  if (!permissions.success)
    return {
      error: UNAUTHORIZED,
    };

  if (gamblingBuilding.user_id !== session.user.id)
    return {
      error: MESSAGES_FN({
        resource: gamblingBuildingsTitle.label.singular.toLowerCase() + "(s)",
      }).RESOURCE_DELETE_UNAUTHORIZED_OTHER,
    };

  if (gamblingBuilding.playthrough.is_finished)
    return {
      error: `You cannot delete data from a finished ${playthroughTitle.label.singular.toLowerCase()}.`,
    };

  try {
    const deletedGamblingBuilding = await db.cog_gambling_building.delete({
      where: { id: gamblingBuilding.id },
      include: gamblingBuildingInclude,
    });

    return {
      success: MESSAGES_FN({
        resource: gamblingBuildingsTitle.label.singular.toLowerCase() + "(s)",
        resourceName: deletedGamblingBuilding.name,
      }).RESOURCE_DELETE_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
