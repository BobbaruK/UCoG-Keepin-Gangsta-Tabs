"use server";

import { MESSAGES, MESSAGES_FN } from "@/constants/messages";
import { gamblingSizeTitle } from "@/constants/page-title/gambling-size";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { headers } from "next/headers";
import z from "zod";
import { AddGamblingSizeSchema } from "../schemas/add-gambling-size";

const UNAUTHORIZED = MESSAGES_FN({
  resource: gamblingSizeTitle.label.singular.toLowerCase(),
}).RESOURCE_CREATE_UNAUTHORIZED;

export const addGamblingSize = async (
  values: z.infer<typeof AddGamblingSizeSchema>,
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
  const validatedFields = AddGamblingSizeSchema.safeParse(values);

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
      permission: { gambling_sizes: ["create"] },
    },
  });

  if (!permissions.success)
    return {
      error: UNAUTHORIZED,
    };

  const { name, max_features, is_dlc } = validatedFields.data;

  try {
    const gamblingSize = await db.cog_gambling_size.create({
      data: {
        name: name || "Noname",
        max_features,
        is_dlc,
      },
    });

    return {
      success: MESSAGES_FN({
        resource: gamblingSizeTitle.label.singular.toLowerCase(),
        resourceName: gamblingSize.name,
      }).RESOURCE_CREATE_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
