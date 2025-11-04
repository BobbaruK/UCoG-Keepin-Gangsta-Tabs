"use server";

import { MESSAGES } from "@/constants/messages";
import { auth } from "@/lib/auth";
import { catchError } from "@/lib/utils/catch-error-action";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";
import { Handle2faSchema } from "@/core/auth/schemas/handle-2fa";

export const enable2fa = async (
  values: z.infer<typeof Handle2faSchema>,
): Promise<
  | {
      error: string;
      success?: undefined;
      totpURI?: undefined;
      backupCodes?: undefined;
    }
  | {
      success: string;
      totpURI: string;
      backupCodes: string[];
      error?: undefined;
    }
> => {
  const validatedFields = Handle2faSchema.safeParse(values);

  if (!validatedFields.success) return { error: MESSAGES.INVALID_FIELDS };

  const { password } = validatedFields.data;

  try {
    const { totpURI, backupCodes } = await auth.api.enableTwoFactor({
      body: {
        password,
      },
      headers: await headers(),
    });

    revalidatePath("/");

    return {
      success: MESSAGES.QR_GENERATED,
      totpURI,
      backupCodes,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const disable2fa = async (
  values: z.infer<typeof Handle2faSchema>,
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
  const validatedFields = Handle2faSchema.safeParse(values);

  if (!validatedFields.success) return { error: MESSAGES.INVALID_FIELDS };

  const { password } = validatedFields.data;

  try {
    await auth.api.disableTwoFactor({
      body: {
        password,
      },
      headers: await headers(),
    });

    revalidatePath("/");

    return {
      success: MESSAGES.TWO_FACTOR_DISABLED,
    };
  } catch (error) {
    return catchError(error);
  }
};
