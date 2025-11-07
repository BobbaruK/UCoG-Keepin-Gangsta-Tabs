"use server";

import { MESSAGES, MESSAGES_FN } from "@/constants/messages";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import z from "zod";
import { SideEffectSchema } from "../schemas/side-effect";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { sideEffectsTitle } from "@/constants/page-title/side-effects";
import { UserRole } from "@/generated/prisma";

export const editSideEffect = async (
  id: string,
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
    const sideEffect = await db.cog_side_effect.update({
      where: { id },
      data: {
        name,
        value,
        type,
        description,
      },
    });

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
