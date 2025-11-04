"use server";

import { MESSAGES } from "@/constants/messages";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { catchError } from "@/lib/utils/catch-error-action";
import { UserSession } from "@/types/session";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const banUser = async ({
  user,
  banReason,
  banExpiresIn,
}: {
  user: UserSession;
  banReason?: string;
  banExpiresIn?: number;
}): Promise<
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

  if (user.banned) {
    return {
      error: `${MESSAGES.USER_ALREADY_BANNED} (${user.email})`,
    };
  }

  try {
    await auth.api.banUser({
      body: {
        userId: user.id,
        banReason,
        banExpiresIn: banExpiresIn,
      },
      headers: await headers(),
    });

    revalidatePath("/");

    return {
      success: `${MESSAGES.USER_ADMIN_BAN} ${user.email}`,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const unbanUser = async (
  user: UserSession,
): Promise<
  | {
      success: string;
      error?: undefined;
    }
  | {
      error: string;
      success?: undefined;
    }
> => {
  if (!user.banned) {
    return {
      error: `${MESSAGES.USER_ALREADY_UNBANNED} (${user.email})`,
    };
  }

  try {
    await auth.api.unbanUser({
      body: {
        userId: user.id,
      },
      headers: await headers(),
    });

    revalidatePath("/");

    return {
      success: `${MESSAGES.USER_ADMIN_UNBAN} ${user.email}`,
    };
  } catch (error) {
    return catchError(error);
  }
};
