"use server";

import { MESSAGES } from "@/constants/messages";
import { auth } from "@/lib/auth";
import { catchError } from "@/lib/utils/catch-error-action";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const signOut = async (): Promise<
  | {
      success: string;
      error?: null;
    }
  | {
      success?: null;
      error: string;
    }
> => {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });

    revalidatePath("/");

    return {
      success: MESSAGES.LOGOUT_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
