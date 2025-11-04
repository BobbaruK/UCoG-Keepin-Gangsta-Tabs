"use server";

import { MESSAGES } from "@/constants/messages";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { createFormattedSlug } from "@/lib/utils/format-string";
import { UserProfile } from "@/types/user-profile";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";
import { PersonalSchema } from "../schemas/personal";

export const updateUser = async (
  values: z.infer<typeof PersonalSchema>,
  user: UserProfile,
): Promise<
  | {
      error: string;
      username_error?: undefined;
      success?: undefined;
    }
  | {
      error: string;
      username_error: boolean;
      success?: undefined;
    }
  | {
      success: string;
      error?: undefined;
      username_error?: undefined;
    }
> => {
  const validatedFields = PersonalSchema.safeParse(values);

  if (!validatedFields.success) return { error: MESSAGES.INVALID_FIELDS };

  const { firstName, lastName, username, bio } = validatedFields.data;

  const slug = createFormattedSlug(firstName, lastName, username);

  try {
    const { available } = await auth.api.isUsernameAvailable({
      body: {
        username,
      },
    });

    if (!available && user.displayUsername !== username) {
      return {
        error: MESSAGES.USERNAME_NOT_AVAILABLE,
        username_error: true,
      };
    }

    await auth.api.updateUser({
      body: {
        firstName,
        lastName,
        slug,
        username,
        name: `${lastName} ${firstName}`,
      },
      headers: await headers(),
    });

    await db.auth_user.update({
      where: { id: user.id },
      data: {
        bio,
      },
    });

    revalidatePath("/");

    return {
      success: MESSAGES.PROFILE_UPDATED,
    };
  } catch (error) {
    return catchError(error);
  }
};
