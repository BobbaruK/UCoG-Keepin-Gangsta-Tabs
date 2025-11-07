"use server";

import { MESSAGES_FN } from "@/constants/messages";
import { traitsTitle } from "@/constants/page-title/traits";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const deleteTrait = async (
  traitId: string,
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
        resource: traitsTitle.label.singular.toLowerCase() + "(s)",
      }).RESOURCE_DELETE_UNAUTHORIZED,
    };
  }

  const data = await auth.api.userHasPermission({
    body: {
      userId: dataSession.user.id,
      role: dataSession.user.role as UserRole,
      permission: { traits: ["delete"] },
    },
  });

  if (!data.success)
    return {
      error: MESSAGES_FN({
        resource: traitsTitle.label.singular.toLowerCase() + "(s)",
      }).RESOURCE_DELETE_UNAUTHORIZED,
    };

  try {
    const trait = await db.cog_trait.delete({
      where: { id: traitId },
    });

    revalidatePath("/trait");

    return {
      success: MESSAGES_FN({
        resource: traitsTitle.label.singular.toLowerCase() + "(s)",
        resourceName: trait.name,
      }).RESOURCE_DELETE_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
