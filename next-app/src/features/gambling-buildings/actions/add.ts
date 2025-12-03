"use server";

import { MESSAGES, MESSAGES_FN } from "@/constants/messages";
import { gamblingBuildingsTitle } from "@/constants/page-title/gambling-buildings";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { gamblingBuildingInclude } from "@/core/cog/gambling-building/constants/include";
import { Playthrough } from "@/core/cog/playthrough/types/playthrough";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { headers } from "next/headers";
import z from "zod";
import { AddGamblingBuildingSchema } from "../schemas/add-gambling-building";

const UNAUTHORIZED = MESSAGES_FN({
  resource: gamblingBuildingsTitle.label.singular.toLowerCase() + "(s)",
}).RESOURCE_CREATE_UNAUTHORIZED;

export const addGamblingBuilding = async ({
  playthrough,
  values,
}: {
  playthrough: Playthrough;
  values: z.infer<typeof AddGamblingBuildingSchema>;
}): Promise<
  | {
      error: string;
      success?: undefined;
    }
  | {
      success: string;
      error?: undefined;
    }
> => {
  const validatedFields = AddGamblingBuildingSchema.safeParse(values);

  if (!validatedFields.success) return { error: MESSAGES.INVALID_FIELDS };

  const { name, manager, gambling_building_size, features } =
    validatedFields.data;

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
      permission: { gambling_building: ["create"] },
    },
  });

  if (!permissions.success)
    return {
      error: UNAUTHORIZED,
    };

  if (playthrough.auth_userId !== session.user.id)
    return {
      error: MESSAGES_FN({
        resource: playthroughTitle.label.singular.toLowerCase(),
      }).RESOURCE_CREATE_UNAUTHORIZED_OTHER,
    };

  if (playthrough.is_finished)
    return {
      error: `You cannot add data to a finished ${playthroughTitle.label.singular.toLowerCase()}.`,
    };

  try {
    const gamblingBuilding = await db.cog_gambling_building.create({
      data: {
        name: name || "Noname",
        gambling_building_size_id: gambling_building_size,
        manager_id: manager,
        features: {
          connect: features.map((feature) => ({ id: feature })),
        },

        playthrough_id: playthrough.id,
        user_id: session.user.id,
      },
      include: gamblingBuildingInclude,
    });

    return {
      success: MESSAGES_FN({
        resource: gamblingBuildingsTitle.label.singular.toLowerCase(),
        resourceName: gamblingBuilding.name,
      }).RESOURCE_CREATE_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
