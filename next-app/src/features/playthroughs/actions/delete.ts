"use server";

import { MESSAGES_FN } from "@/constants/messages";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { Playthrough } from "@/core/db/playthrough/types/playthrough";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const deletePlaythrough = async (
  playthrough: Playthrough,
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
        resource: playthroughTitle.label.singular.toLowerCase() + "(s)",
      }).RESOURCE_DELETE_UNAUTHORIZED,
    };
  }

  const user = await db.auth_user.findUnique({
    where: {
      id: dataSession.user.id,
    },
  });

  if (!user)
    return {
      error: MESSAGES_FN({
        resource: playthroughTitle.label.singular.toLowerCase() + "(s)",
      }).RESOURCE_DELETE_UNAUTHORIZED,
    };

  if (playthrough.auth_userId !== user.id)
    return {
      error: MESSAGES_FN({
        resource: playthroughTitle.label.singular.toLowerCase() + "(s)",
      }).RESOURCE_DELETE_UNAUTHORIZED_OTHER,
    };

  const permissions = await auth.api.userHasPermission({
    body: {
      userId: dataSession.user.id,
      role: dataSession.user.role as UserRole,
      permissions: { playthrough: ["delete"] },
    },
  });

  if (!permissions.success)
    return {
      error: MESSAGES_FN({
        resource: playthroughTitle.label.singular.toLowerCase() + "(s)",
      }).RESOURCE_DELETE_UNAUTHORIZED,
    };

  try {
    const data = await db.cog_playthrough.delete({
      where: { id: playthrough.id },
    });

    revalidatePath(playthroughTitle.href);

    return {
      success: MESSAGES_FN({
        resource: playthroughTitle.label.singular.toLowerCase() + "(s)",
        resourceName: data.name,
      }).RESOURCE_DELETE_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
