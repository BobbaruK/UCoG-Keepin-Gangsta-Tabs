"use server";

import { MESSAGES, MESSAGES_FN } from "@/constants/messages";
import { buildingTypesTitle } from "@/constants/page-title/building-types";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { headers } from "next/headers";
import z from "zod";
import { AddBuildingTypeSchema } from "../schemas/add-building-type";

const UNAUTHORIZED = MESSAGES_FN({
  resource: buildingTypesTitle.label.plural.toLowerCase(),
}).RESOURCE_CREATE_UNAUTHORIZED;

export const addBuildingType = async (
  values: z.infer<typeof AddBuildingTypeSchema>,
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
  const validatedFields = AddBuildingTypeSchema.safeParse(values);

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
      permission: { building_types: ["create"] },
    },
  });

  if (!permissions.success)
    return {
      error: UNAUTHORIZED,
    };

  const { name } = validatedFields.data;

  try {
    const routeType = await db.cog_building_type.create({
      data: {
        name: name || "Noname",
      },
    });

    return {
      success: MESSAGES_FN({
        resource: buildingTypesTitle.label.singular.toLowerCase(),
        resourceName: routeType.name,
      }).RESOURCE_CREATE_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
