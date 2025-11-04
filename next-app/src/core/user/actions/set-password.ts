"use server";

import { MESSAGES } from "@/constants/messages";
import { auth } from "@/lib/auth";
import { catchError } from "@/lib/utils/catch-error-action";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";
import { NewPasswordSchema } from "../schemas/new-password";

export const setPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
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
  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) return { error: MESSAGES.INVALID_FIELDS };

  const { password, confirmPassword } = validatedFields.data;

  if (password !== confirmPassword)
    return {
      error: MESSAGES.PASSWORDS_NOT_MATCH,
    };

  try {
    await auth.api.setPassword({
      body: { newPassword: password },
      headers: await headers(),
    });

    revalidatePath("/");

    return {
      success: MESSAGES.PASSWORD_SET,
    };
  } catch (error) {
    return catchError(error);
  }
};
