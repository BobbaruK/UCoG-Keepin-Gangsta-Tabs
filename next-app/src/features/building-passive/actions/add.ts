"use server";

import { MESSAGES, MESSAGES_FN } from "@/constants/messages";
import { buildingPassiveTitle } from "@/constants/page-title/building-passive";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { headers } from "next/headers";
import z from "zod";
import { AddBuildingPassiveSchema } from "../schemas/add-building-passive";

const UNAUTHORIZED = MESSAGES_FN({
  resource: buildingPassiveTitle.label.plural.toLowerCase(),
}).RESOURCE_CREATE_UNAUTHORIZED;

export const addBuildingPassive = async (
  values: z.infer<typeof AddBuildingPassiveSchema>,
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
  const validatedFields = AddBuildingPassiveSchema.safeParse(values);

  if (!validatedFields.success) return { error: MESSAGES.INVALID_FIELDS };

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
      permission: { building_passive_production: ["create"] },
    },
  });

  if (!permissions.success)
    return {
      error: UNAUTHORIZED,
    };

  const { quantity, resource } = validatedFields.data;

  try {
    const buildingPassive = await db.cog_building_passive_production.create({
      data: {
        quantity,
        resourceId: resource,
      },
    });

    return {
      success: MESSAGES_FN({
        resource: buildingPassiveTitle.label.singular.toLowerCase(),
        resourceName: String(buildingPassive.quantity),
      }).RESOURCE_CREATE_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
