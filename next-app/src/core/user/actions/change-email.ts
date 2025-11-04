"use server";

import { MESSAGES } from "@/constants/messages";
import { DEFAULT_LOGIN_REDIRECT } from "@/constants/routes";
import { ChangeEmailSchema } from "@/core/auth/schemas/change-email";
import { auth } from "@/lib/auth";
import { catchError } from "@/lib/utils/catch-error-action";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";

export const changeEmail = async (
  values: z.infer<typeof ChangeEmailSchema>,
  userEmail: string,
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
  const validatedFields = ChangeEmailSchema.safeParse(values);

  if (!validatedFields.success) return { error: MESSAGES.INVALID_FIELDS };

  const { oldEmail, newEmail } = validatedFields.data;

  if (userEmail !== oldEmail)
    return {
      error: MESSAGES.EMAIL_OLD_NOT_MATCH,
    };

  try {
    await auth.api.changeEmail({
      body: {
        newEmail: newEmail,
        callbackURL: DEFAULT_LOGIN_REDIRECT,
      },
      headers: await headers(),
    });

    revalidatePath("/");

    return {
      success: MESSAGES.EMAIL_CHANGED,
    };
  } catch (error) {
    return catchError(error);
  }
};
