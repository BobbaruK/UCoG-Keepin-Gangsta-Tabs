"use server";

import { MESSAGES, MESSAGES_FN } from "@/constants/messages";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import z from "zod";
import { AddTraitSchema } from "../schemas/add-trait";
import { auth } from "@/lib/auth";
import { traitsTitle } from "@/constants/page-title/traits";
import { UserRole } from "@/generated/prisma";
import { headers } from "next/headers";

export const addTrait = async (
  values: z.infer<typeof AddTraitSchema>,
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
  const validatedFields = AddTraitSchema.safeParse(values);

  if (!validatedFields.success) return { error: MESSAGES.INVALID_FIELDS };

  const dataSession = await auth.api.getSession({
    headers: await headers(),
  });

  if (!dataSession) {
    return {
      error: MESSAGES_FN({
        resource: traitsTitle.label.singular.toLowerCase() + "(s)",
      }).RESOURCE_CREATE_UNAUTHORIZED,
    };
  }

  const data = await auth.api.userHasPermission({
    body: {
      userId: dataSession.user.id,
      role: dataSession.user.role as UserRole,
      permission: { traits: ["create"] },
    },
  });

  if (!data.success)
    return {
      error: MESSAGES_FN({
        resource: traitsTitle.label.singular.toLowerCase() + "(s)",
      }).RESOURCE_CREATE_UNAUTHORIZED,
    };

  const { name, image, description, sideEffect } = validatedFields.data;

  try {
    const trait = await db.cog_trait.create({
      data: {
        name,
        image: image || null,
        description: description || null,
        cog_side_effectId: sideEffect || null,
      },
    });

    return {
      success: MESSAGES_FN({
        resource: traitsTitle.label.singular.toLowerCase(),
        resourceName: trait.name,
      }).RESOURCE_CREATE_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
