"use server";

import { MESSAGES, MESSAGES_FN } from "@/constants/messages";
import { crewLevelsTitle } from "@/constants/page-title/crew-levels";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { headers } from "next/headers";
import z from "zod";
import { AddCrewLevelSchema } from "../schemas/add-level";

const UNAUTHORIZE = MESSAGES_FN({
  resource: crewLevelsTitle.label.singular.toLowerCase(),
}).RESOURCE_CREATE_UNAUTHORIZED;

export const addCrewLevel = async (
  values: z.infer<typeof AddCrewLevelSchema>,
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
  const validatedFields = AddCrewLevelSchema.safeParse(values);

  if (!validatedFields.success) return { error: MESSAGES.INVALID_FIELDS };

  const dataSession = await auth.api.getSession({
    headers: await headers(),
  });

  if (!dataSession) {
    return {
      error: UNAUTHORIZE,
    };
  }

  const data = await auth.api.userHasPermission({
    body: {
      userId: dataSession.user.id,
      role: dataSession.user.role as UserRole,
      permission: { crew_levels: ["create"] },
    },
  });

  if (!data.success)
    return {
      error: UNAUTHORIZE,
    };

  const { name, description, maxLevel, type } = validatedFields.data;

  try {
    const level = await db.cog_crew_level.create({
      data: {
        name: name || "Noname",
        description: description || null,
        max_level: maxLevel,
        type,
      },
    });

    return {
      success: MESSAGES_FN({
        resource: crewLevelsTitle.label.singular.toLowerCase(),
        resourceName: level.name,
      }).RESOURCE_CREATE_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
