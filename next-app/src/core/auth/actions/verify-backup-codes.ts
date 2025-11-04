"use server";

import { MESSAGES } from "@/constants/messages";
import { RecoverAccountSchema } from "@/core/auth/schemas/recover-account";
import { auth } from "@/lib/auth";
import { catchError } from "@/lib/utils/catch-error-action";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";

export const verifyBackupCodes = async (
  values: z.infer<typeof RecoverAccountSchema>,
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
  const validatedFields = RecoverAccountSchema.safeParse(values);

  if (!validatedFields.success) return { error: MESSAGES.INVALID_FIELDS };

  const { code, remember } = validatedFields.data;

  try {
    await auth.api.verifyBackupCode({
      body: {
        code,
        disableSession: false,
        trustDevice: remember,
      },
      headers: await headers(),
    });

    revalidatePath("/");

    return {
      success: MESSAGES.BACKUPCODE_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
