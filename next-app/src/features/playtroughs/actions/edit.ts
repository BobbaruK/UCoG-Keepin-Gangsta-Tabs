"use server";

import { MESSAGES, MESSAGES_FN } from "@/constants/messages";
import { playthroughTitle } from "@/constants/page-title/playtrough";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { headers } from "next/headers";
import z from "zod";
import { AddPlaythroughSchema } from "../schemas/add";
import { Playthrough } from "../types/playthrough";

export const editPlaythrough = async (
  playthrough: Playthrough,
  values: z.infer<typeof AddPlaythroughSchema>,
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
  const validatedFields = AddPlaythroughSchema.safeParse(values);

  if (!validatedFields.success) return { error: MESSAGES.INVALID_FIELDS };

  const dataSession = await auth.api.getSession({
    headers: await headers(),
  });

  if (!dataSession)
    return {
      error: MESSAGES_FN({
        resource: playthroughTitle.label.singular.toLowerCase() + "(s)",
      }).RESOURCE_EDIT_UNAUTHORIZED,
    };

  const user = await db.auth_user.findUnique({
    where: {
      id: dataSession.user.id,
    },
  });

  if (!user)
    return {
      error: MESSAGES_FN({
        resource: playthroughTitle.label.singular.toLowerCase() + "(s)",
      }).RESOURCE_EDIT_UNAUTHORIZED,
    };

  if (playthrough.auth_userId !== user.id)
    return {
      error: MESSAGES_FN({
        resource: playthroughTitle.label.singular.toLowerCase() + "(s)",
      }).RESOURCE_EDIT_UNAUTHORIZED_OTHER,
    };

  const permission = await auth.api.userHasPermission({
    body: {
      userId: dataSession.user.id,
      role: dataSession.user.role as UserRole,
      permission: { playthrough: ["update"] },
    },
  });

  if (!permission.success)
    return {
      error: MESSAGES_FN({
        resource: playthroughTitle.label.singular.toLowerCase() + "(s)",
      }).RESOURCE_EDIT_UNAUTHORIZED,
    };

  const {
    name,
    seed,
    isPublic,
    passengerRailStation,
    freightRailStation,
    respectForTheLaw,
    laws,
  } = validatedFields.data;

  try {
    const data = await db.cog_playthrough.update({
      where: {
        id: playthrough.id,
      },
      data: {
        name,
        seed: seed || null,
        is_public: isPublic,
        passenger_rail_station: passengerRailStation,
        freight_rail_station: freightRailStation,
        respect_for_the_law: respectForTheLaw,
        laws: {
          set: laws.map((law) => ({ id: law })),
        },
      },
    });

    return {
      success: MESSAGES_FN({
        resource: playthroughTitle.label.singular.toLowerCase(),
        resourceName: data.name,
      }).RESOURCE_EDIT_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
