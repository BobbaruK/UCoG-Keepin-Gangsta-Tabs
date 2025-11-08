"use server";

import { MESSAGES, MESSAGES_FN } from "@/constants/messages";
import { sideEffectsTitle } from "@/constants/page-title/side-effects";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";
import { SideEffectSchema } from "../schemas/side-effect";

export const addSideEffect = async (
  values: z.infer<typeof SideEffectSchema>,
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
  const validatedFields = SideEffectSchema.safeParse(values);

  if (!validatedFields.success) return { error: MESSAGES.INVALID_FIELDS };

  const dataSession = await auth.api.getSession({
    headers: await headers(),
  });

  if (!dataSession) {
    return {
      error: MESSAGES_FN({
        resource: sideEffectsTitle.label.singular.toLowerCase() + "(s)",
      }).RESOURCE_CREATE_UNAUTHORIZED,
    };
  }

  const data = await auth.api.userHasPermission({
    body: {
      userId: dataSession.user.id,
      role: dataSession.user.role as UserRole,
      permission: { sideEffects: ["create"] },
    },
  });

  if (!data.success)
    return {
      error: MESSAGES_FN({
        resource: sideEffectsTitle.label.singular.toLowerCase() + "(s)",
      }).RESOURCE_CREATE_UNAUTHORIZED,
    };

  const { name, type, value, description } = validatedFields.data;

  try {
    const sideEffect = await db.cog_side_effect.create({
      data: {
        name,
        value,
        type,
        description: description || null,
      },
    });

    revalidatePath(sideEffectsTitle.href);

    return {
      success: MESSAGES_FN({
        resource: sideEffectsTitle.label.singular.toLowerCase(),
        resourceName: sideEffect.name,
      }).RESOURCE_CREATE_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
