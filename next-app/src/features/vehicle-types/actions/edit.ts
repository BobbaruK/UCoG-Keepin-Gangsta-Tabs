"use server";

import { MESSAGES, MESSAGES_FN } from "@/constants/messages";
import { vehicleTypesTitle } from "@/constants/page-title/vehicle-types";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { headers } from "next/headers";
import z from "zod";
import { AddVehicleTypeSchema } from "../schemas/add-vehicle-type";

const UNAUTHORIZED = MESSAGES_FN({
  resource: vehicleTypesTitle.label.singular.toLowerCase(),
}).RESOURCE_EDIT_UNAUTHORIZED;

export const editVehicleType = async (
  id: string,
  values: z.infer<typeof AddVehicleTypeSchema>,
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
  const validatedFields = AddVehicleTypeSchema.safeParse(values);

  if (!validatedFields.success) return { error: MESSAGES.INVALID_FIELDS };

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
      permission: { vehicle_types: ["update"] },
    },
  });

  if (!data.success)
    return {
      error: UNAUTHORIZED,
    };

  const { name, capacity } = validatedFields.data;

  try {
    const vehicleType = await db.cog_vehicle_type.update({
      where: {
        id,
      },
      data: {
        name: name || "Noname",
        capacity,
      },
    });

    return {
      success: MESSAGES_FN({
        resource: vehicleTypesTitle.label.singular.toLowerCase(),
        resourceName: vehicleType.name,
      }).RESOURCE_EDIT_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
