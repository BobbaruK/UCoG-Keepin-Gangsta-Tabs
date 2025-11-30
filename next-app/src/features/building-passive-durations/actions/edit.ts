"use server";

import { MESSAGES, MESSAGES_FN } from "@/constants/messages";
import { buildingPassiveDurationTitle } from "@/constants/page-title/building-passive-duration";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { headers } from "next/headers";
import z from "zod";
import { AddBuildingPassiveDurationSchema } from "../schemas/add-building-passive-duration";

const UNAUTHORIZED = MESSAGES_FN({
  resource: buildingPassiveDurationTitle.label.plural.toLowerCase(),
}).RESOURCE_EDIT_UNAUTHORIZED;

export const editBuildingPassiveDuration = async (
  id: string,
  values: z.infer<typeof AddBuildingPassiveDurationSchema>,
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
  const validatedFields = AddBuildingPassiveDurationSchema.safeParse(values);

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
      permission: { building_passive_production_duration: ["update"] },
    },
  });

  if (!permissions.success)
    return {
      error: UNAUTHORIZED,
    };

  const { name, turns } = validatedFields.data;

  try {
    const buildingPassiveDuration =
      await db.cog_building_passive_production_duration.update({
        where: {
          id,
        },
        data: {
          name: name || "Noname",
          turns,
        },
      });

    return {
      success: MESSAGES_FN({
        resource: buildingPassiveDurationTitle.label.singular.toLowerCase(),
        resourceName: buildingPassiveDuration.name,
      }).RESOURCE_EDIT_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
