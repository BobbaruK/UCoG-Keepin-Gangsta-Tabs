"use server";

import { MESSAGES, MESSAGES_FN } from "@/constants/messages";
import { buildingSizesTitle } from "@/constants/page-title/building-sizes";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { headers } from "next/headers";
import z from "zod";
import { AddBuildingSizeSchema } from "../schemas/add-building-size";

const UNAUTHORIZED = MESSAGES_FN({
  resource: buildingSizesTitle.label.plural.toLowerCase(),
}).RESOURCE_EDIT_UNAUTHORIZED;

export const editBuildingSize = async (
  id: string,
  values: z.infer<typeof AddBuildingSizeSchema>,
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
  const validatedFields = AddBuildingSizeSchema.safeParse(values);

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
      permission: { building_size: ["update"] },
    },
  });

  if (!permissions.success)
    return {
      error: UNAUTHORIZED,
    };

  const { name, capacity } = validatedFields.data;

  try {
    const buildingSize = await db.cog_building_size.update({
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
        resource: buildingSizesTitle.label.singular.toLowerCase(),
        resourceName: buildingSize.name,
      }).RESOURCE_EDIT_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
