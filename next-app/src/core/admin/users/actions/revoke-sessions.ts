"use server";

import { MESSAGES } from "@/constants/messages";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { catchError } from "@/lib/utils/catch-error-action";
import { UserSession } from "@/types/session";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const revokeUserSessions = async (
  user: UserSession,
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
  if (user.role === UserRole.OWNER)
    return {
      error: MESSAGES.USER_ADMIN_OWNER,
    };

  try {
    await auth.api.revokeUserSessions({
      body: {
        userId: user.id,
      },
      headers: await headers(),
    });

    revalidatePath("/");

    return {
      success: `${MESSAGES.SESSION_ADMIN_REVOKED_ALL} (${user.email})`,
    };
  } catch (error) {
    return catchError(error);
  }
};
