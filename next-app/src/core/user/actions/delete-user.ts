"use server";

import { MESSAGES } from "@/constants/messages";
import { auth } from "@/lib/auth";
import { catchError } from "@/lib/utils/catch-error-action";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";
import { DeleteAccountSchema } from "../schemas/delete-account";

export const deleteUser = async (
  values: z.infer<typeof DeleteAccountSchema>,
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
  const validatedFields = DeleteAccountSchema.safeParse(values);

  if (!validatedFields.success) return { error: MESSAGES.INVALID_FIELDS };

  const { email } = validatedFields.data;

  if (userEmail !== email)
    return {
      error: MESSAGES.EMAIL_OLD_NOT_MATCH,
    };

  try {
    const data = await auth.api.deleteUser({
      body: {
        callbackURL: "/goodbye",
      },
      headers: await headers(),
    });

    revalidatePath("/");

    return {
      success: data.message,
    };
  } catch (error) {
    return catchError(error);
  }
};
