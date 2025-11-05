"use server";

import { MESSAGES } from "@/constants/messages";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import z from "zod";
import { SideEffectSchema } from "../schemas/side-effect";

export const addSideEffect = async (
  values: z.infer<typeof SideEffectSchema>,
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
  const validatedFields = SideEffectSchema.safeParse(values);

  if (!validatedFields.success) return { error: MESSAGES.INVALID_FIELDS };

  const { name, type, value, description } = validatedFields.data;

  try {
    await db.cog_side_effect.create({
      data: {
        name,
        value,
        type,
        description,
      },
    });

    return {
      success: "s-a bagat",
    };
  } catch (error) {
    return catchError(error);
  }
};
