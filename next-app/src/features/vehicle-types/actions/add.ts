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

export const addVehicleType = async (
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
      error: MESSAGES_FN({
        resource: vehicleTypesTitle.label.singular.toLowerCase() + "(s)",
      }).RESOURCE_CREATE_UNAUTHORIZED,
    };
  }

  const data = await auth.api.userHasPermission({
    body: {
      userId: dataSession.user.id,
      role: dataSession.user.role as UserRole,
      permission: { vehicle_types: ["create"] },
    },
  });

  if (!data.success)
    return {
      error: MESSAGES_FN({
        resource: vehicleTypesTitle.label.singular.toLowerCase() + "(s)",
      }).RESOURCE_CREATE_UNAUTHORIZED,
    };

  const { name, capacity } = validatedFields.data;

  try {
    const vehicleType = await db.cog_vehicle_type.create({
      data: {
        name,
        capacity,
      },
    });

    return {
      success: MESSAGES_FN({
        resource: vehicleTypesTitle.label.singular.toLowerCase(),
        resourceName: vehicleType.name,
      }).RESOURCE_CREATE_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
