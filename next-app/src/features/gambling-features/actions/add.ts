"use server";

import { MESSAGES, MESSAGES_FN } from "@/constants/messages";
import { gamblingFeatureTitle } from "@/constants/page-title/gambling-feature";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { headers } from "next/headers";
import z from "zod";
import { AddGamblingFeatureSchema } from "../schemas/add-gambling-size";

const UNAUTHORIZED = MESSAGES_FN({
  resource: gamblingFeatureTitle.label.singular.toLowerCase(),
}).RESOURCE_CREATE_UNAUTHORIZED;

export const addGamblingFeature = async (
  values: z.infer<typeof AddGamblingFeatureSchema>,
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
  const validatedFields = AddGamblingFeatureSchema.safeParse(values);

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
      permission: { gambling_features: ["create"] },
    },
  });

  if (!permissions.success)
    return {
      error: UNAUTHORIZED,
    };

  const { name, cash_on_hand, weekly_cost, is_dlc, type } =
    validatedFields.data;

  try {
    const gamblingFeature = await db.cog_gambling_feature.create({
      data: {
        name: name || "Noname",
        cash_on_hand,
        weekly_cost,
        type,
        is_dlc,
      },
    });

    return {
      success: MESSAGES_FN({
        resource: gamblingFeatureTitle.label.singular.toLowerCase(),
        resourceName: gamblingFeature.name,
      }).RESOURCE_CREATE_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
