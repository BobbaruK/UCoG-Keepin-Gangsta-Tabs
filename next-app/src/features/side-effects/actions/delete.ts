"use server";

import { MESSAGES_FN } from "@/constants/messages";
import { sideEffectsTitle } from "@/constants/page-title/side-effects";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const deleteSideEffect = async (
  id: string,
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
      permission: { sideEffects: ["delete"] },
    },
  });

  if (!data.success)
    return {
      error: MESSAGES_FN({
        resource: sideEffectsTitle.label.singular.toLowerCase() + "(s)",
      }).RESOURCE_CREATE_UNAUTHORIZED,
    };

  try {
    const sideEffect = await db.cog_side_effect.delete({
      where: { id },
    });

    revalidatePath(sideEffectsTitle.href);

    return {
      success: MESSAGES_FN({
        resource: sideEffectsTitle.label.singular.toLowerCase(),
        resourceName: sideEffect.name,
      }).RESOURCE_DELETE_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
