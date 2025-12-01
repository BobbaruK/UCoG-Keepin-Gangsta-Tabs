"use server";

import { MESSAGES, MESSAGES_FN } from "@/constants/messages";
import { buildingTitle } from "@/constants/page-title/building";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { Building } from "@/core/cog/building/types/building";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { headers } from "next/headers";
import z from "zod";
import { AddBuildingSchema } from "../schemas/add";

const UNAUTHORIZED = MESSAGES_FN({
  resource: buildingTitle.label.singular.toLowerCase() + "(s)",
}).RESOURCE_EDIT_UNAUTHORIZED;

export const editBuilding = async (
  building: Building,
  values: z.infer<typeof AddBuildingSchema>,
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
  const validatedFields = AddBuildingSchema.safeParse(values);

  if (!validatedFields.success) return { error: MESSAGES.INVALID_FIELDS };

  const {
    name,
    size,
    type,
    manager,
    backroom,
    passive_productions,
    passive_production_duration,
  } = validatedFields.data;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session)
    return {
      error: UNAUTHORIZED,
    };

  const permissions = await auth.api.userHasPermission({
    body: {
      userId: session.user.id,
      role: session.user.role as UserRole,
      permission: { building: ["update"] },
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
      }).RESOURCE_EDIT_UNAUTHORIZED_OTHER,
    };

  if (building.playthrough.is_finished)
    return {
      error: `You cannot edit data from a finished ${playthroughTitle.label.singular.toLowerCase()}.`,
    };

  try {
    const updatedBuilding = await db.cog_building.update({
      where: {
        id: building.id,
      },
      data: {
        name: name || "Noname",
        size_id: size,
        type_id: type || null,
        manager_id: manager || null,
        backroom_id: backroom || null,
        passive_production_duration_id: passive_production_duration || null,
        passive_productions: {
          set: passive_productions.map((production) => ({
            id: production,
          })),
        },

        playthrough_id: building.playthrough.id,
        user_id: session.user.id,
      },
    });

    return {
      success: MESSAGES_FN({
        resource: buildingTitle.label.singular.toLowerCase(),
        resourceName: updatedBuilding.name,
      }).RESOURCE_EDIT_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
