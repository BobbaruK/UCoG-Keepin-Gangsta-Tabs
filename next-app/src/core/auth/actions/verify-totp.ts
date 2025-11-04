"use server";

import { MESSAGES } from "@/constants/messages";
import { OTP } from "@/core/auth/schemas/otp";
import { auth } from "@/lib/auth";
import { catchError } from "@/lib/utils/catch-error-action";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";

export const verifyTotp = async (
  values: z.infer<typeof OTP>,
  isFirstTime: boolean,
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
  const validatedFields = OTP.safeParse(values);

  if (!validatedFields.success) return { error: MESSAGES.INVALID_FIELDS };

  const { code, remember } = validatedFields.data;

  try {
    await auth.api.verifyTOTP({
      body: {
        code,
        trustDevice: remember,
      },
      headers: await headers(),
    });

    revalidatePath("/");

    return {
      success: isFirstTime ? MESSAGES.QR_VALIDATED : MESSAGES.LOGIN_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
