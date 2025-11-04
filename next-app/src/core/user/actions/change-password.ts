"use server";

import { MESSAGES } from "@/constants/messages";
import { ChangePasswordSchema } from "@/core/auth/schemas/change-password";
import { auth } from "@/lib/auth";
import { catchError } from "@/lib/utils/catch-error-action";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";

export const changePassword = async (
  values: z.infer<typeof ChangePasswordSchema>,
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
  const validatedFields = ChangePasswordSchema.safeParse(values);

  if (!validatedFields.success) return { error: MESSAGES.INVALID_FIELDS };

  const { currentPassword, newPassword, confirmNewPassword } =
    validatedFields.data;

  if (newPassword !== confirmNewPassword) {
    return {
      error: MESSAGES.PASSWORDS_NOT_MATCH,
    };
  }

  try {
    await auth.api.changePassword({
      body: {
        newPassword,
        currentPassword,
        revokeOtherSessions: true,
      },
      headers: await headers(),
    });

    revalidatePath("/");

    return {
      success: MESSAGES.PASSWORD_NEW,
    };
  } catch (error) {
    return catchError(error);
  }
};
