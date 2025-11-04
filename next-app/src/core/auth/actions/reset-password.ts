"use server";

import { MESSAGES } from "@/constants/messages";
import { ResetPasswordSchema } from "@/core/auth/schemas/reset-password";
import { auth } from "@/lib/auth";
import { catchError } from "@/lib/utils/catch-error-action";
import { revalidatePath } from "next/cache";
import z from "zod";

export const resetPassword = async (
  values: z.infer<typeof ResetPasswordSchema>,
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
  const validatedFields = ResetPasswordSchema.safeParse(values);

  if (!validatedFields.success) return { error: MESSAGES.INVALID_FIELDS };

  const { email } = validatedFields.data;

  try {
    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: `${process.env.NEXT_PUBLIC_API_URL}/new-password`,
      },
    });

    revalidatePath("/");

    return {
      success: MESSAGES.PASSWORD_RESET,
    };
  } catch (error) {
    return catchError(error);
  }
};
