"use server";

import { MESSAGES_FN } from "@/constants/messages";
import { vehicleTypesTitle } from "@/constants/page-title/vehicle-types";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { headers } from "next/headers";

const UNAUTHORIZED = MESSAGES_FN({
  resource: vehicleTypesTitle.label.singular.toLowerCase(),
}).RESOURCE_DELETE_UNAUTHORIZED;

export const deleteVehicleType = async (
  traitId: string,
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
      permission: { vehicle_types: ["delete"] },
    },
  });

  if (!data.success)
    return {
      error: UNAUTHORIZED,
    };

  try {
    const vehicleTypes = await db.cog_vehicle_type.delete({
      where: { id: traitId },
    });

    return {
      success: MESSAGES_FN({
        resource: vehicleTypesTitle.label.singular.toLowerCase() + "(s)",
        resourceName: vehicleTypes.name,
      }).RESOURCE_DELETE_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
