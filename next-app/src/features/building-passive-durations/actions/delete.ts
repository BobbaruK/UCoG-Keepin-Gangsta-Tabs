"use server";

import { MESSAGES_FN } from "@/constants/messages";
import { buildingPassiveDurationTitle } from "@/constants/page-title/building-passive-duration";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { headers } from "next/headers";

const UNAUTHORIZED = MESSAGES_FN({
  resource: buildingPassiveDurationTitle.label.plural.toLowerCase(),
}).RESOURCE_DELETE_UNAUTHORIZED;

export const deleteBuildingPassiveDuration = async (
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
      permission: { building_passive_production_duration: ["delete"] },
    },
  });

  if (!permissions.success)
    return {
      error: UNAUTHORIZED,
    };

  try {
    const buildingPassiveDuration = await db.cog_building_passive_production_duration.delete({
      where: { id },
    });

    return {
      success: MESSAGES_FN({
        resource: buildingPassiveDurationTitle.label.singular.toLowerCase(),
        resourceName: buildingPassiveDuration.name,
      }).RESOURCE_DELETE_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
