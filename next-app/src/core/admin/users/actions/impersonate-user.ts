"use server";

import { MESSAGES } from "@/constants/messages";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { catchError } from "@/lib/utils/catch-error-action";
import { UserSession } from "@/types/session";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const impersonateUser = async (
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
    await auth.api.impersonateUser({
      body: {
        userId: user.id,
      },
      headers: await headers(),
    });

    revalidatePath("/");

    return {
      success: `${MESSAGES.USER_ADMIN_IMPERSONATE} ${user.email}`,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const stopImpersonatingUser = async (): Promise<
  | {
      success: string;
      error?: undefined;
    }
  | {
      error: string;
      success?: undefined;
    }
> => {
  try {
    await auth.api.stopImpersonating({
      headers: await headers(),
    });

    revalidatePath("/");

    return {
      success: `${MESSAGES.USER_ADMIN_STOP_IMPERSONATE}`,
    };
  } catch (error) {
    return catchError(error);
  }
};
