"use server";

import { MESSAGES } from "@/constants/messages";
import { NewPasswordSchema } from "@/core/user/schemas/new-password";
import { auth } from "@/lib/auth";
import { catchError } from "@/lib/utils/catch-error-action";
import { revalidatePath } from "next/cache";
import z from "zod";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token: string,
): Promise<
  | {
      success: string;
      error?: null;
    }
  | {
      success?: null;
      error: string;
    }
> => {
  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) return { error: MESSAGES.INVALID_FIELDS };

  const { password, confirmPassword } = validatedFields.data;

  if (password !== confirmPassword)
    return {
      error: MESSAGES.PASSWORDS_NOT_MATCH,
    };

  if (!token)
    return {
      error: MESSAGES.TOKEN_MISSING,
    };

  try {
    await auth.api.resetPassword({
      body: {
        newPassword: password,
        token,
      },
    });

    revalidatePath("/");

    return {
      success: MESSAGES.PASSWORD_NEW,
    };
  } catch (error) {
    return catchError(error);
  }
};
