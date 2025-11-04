"use server";

import { MESSAGES } from "@/constants/messages";
import { auth } from "@/lib/auth";
import { catchError } from "@/lib/utils/catch-error-action";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";
import { ChangeAvatarSchema } from "../schemas/change-avatar";

export const changeAvatar = async (
  values: z.infer<typeof ChangeAvatarSchema>,
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
  const validatedFields = ChangeAvatarSchema.safeParse(values);

  if (!validatedFields.success) return { error: MESSAGES.INVALID_FIELDS };

  const { url } = validatedFields.data;

  try {
    await auth.api.updateUser({
      body: {
        image: url,
      },
      headers: await headers(),
    });

    revalidatePath("/");

    return {
      success: MESSAGES.USER_AVATAR_UPDATE,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const removeAvatar = async (): Promise<
  | {
      success: string;
      error?: undefined;
    }
  | {
      error: string;
      success?: undefined;
    }
> => {
  try {
    await auth.api.updateUser({
      body: {
        image: "",
      },
      headers: await headers(),
    });

    revalidatePath("/");

    return {
      success: MESSAGES.USER_AVATAR_REMOVE,
    };
  } catch (error) {
    return catchError(error);
  }
};
