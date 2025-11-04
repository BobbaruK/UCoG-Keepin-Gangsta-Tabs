"use server";

import { MESSAGES } from "@/constants/messages";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { catchError } from "@/lib/utils/catch-error-action";
import { UserSession } from "@/types/session";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const removeUser = async (
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
    await auth.api.removeUser({
      body: {
        userId: user.id,
      },
      headers: await headers(),
    });

    revalidatePath("/");

    return {
      success: `${MESSAGES.USER_ADMIN_REMOVE} ${user.email}`,
    };
  } catch (error) {
    return catchError(error);
  }
};
