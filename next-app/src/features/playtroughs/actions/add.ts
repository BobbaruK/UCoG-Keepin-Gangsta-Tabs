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

export const addPlaythrough = async (
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

  if (!dataSession) {
    return {
      error: MESSAGES_FN({
        resource: playthroughTitle.label.singular.toLowerCase() + "(s)",
      }).RESOURCE_CREATE_UNAUTHORIZED,
    };
  }

  const user = await db.auth_user.findUnique({
    where: {
      id: dataSession.user.id,
    },
  });

  if (!user) {
    return {
      error: MESSAGES_FN({
        resource: playthroughTitle.label.singular.toLowerCase() + "(s)",
      }).RESOURCE_CREATE_UNAUTHORIZED,
    };
  }

  const permissions = await auth.api.userHasPermission({
    body: {
      userId: user.id,
      role: user.role as UserRole,
      permission: { playthrough: ["create"] },
    },
  });

  if (!permissions.success)
    return {
      error: MESSAGES_FN({
        resource: playthroughTitle.label.singular.toLowerCase() + "(s)",
      }).RESOURCE_CREATE_UNAUTHORIZED,
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
    const playthrough = await db.cog_playthrough.create({
      data: {
        name,
        seed: seed || null,
        is_public: isPublic,
        passenger_rail_station: passengerRailStation,
        freight_rail_station: freightRailStation,
        respect_for_the_law: respectForTheLaw,
        laws: {
          connect: laws.map((law) => ({ id: law })),
        },
        auth_userId: user.id,
      },
    });

    return {
      success: MESSAGES_FN({
        resource: playthroughTitle.label.singular.toLowerCase(),
        resourceName: playthrough.name,
      }).RESOURCE_CREATE_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
