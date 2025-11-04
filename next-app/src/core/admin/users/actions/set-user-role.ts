"use server";

import { MESSAGES } from "@/constants/messages";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { catchError } from "@/lib/utils/catch-error-action";
import { UserSession } from "@/types/session";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const setUserRole = async ({
  user,
  role,
}: {
  user: UserSession;
  role: UserRole;
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
  // if (user.role === UserRole.OWNER)
  //   return {
  //     error: MESSAGES.USER_ADMIN_OWNER,
  //   };

  try {
    await auth.api.setRole({
      body: {
        userId: user.id,
        role,
      },
      headers: await headers(),
    });

    revalidatePath("/");

    return {
      success: `${MESSAGES.USER_ADMIN_CHANGE_ROLE} (${user.email} - ${role})`,
    };
  } catch (error) {
    return catchError(error);
  }
};
