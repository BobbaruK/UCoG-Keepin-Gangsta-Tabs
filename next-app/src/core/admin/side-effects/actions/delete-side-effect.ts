"use server";

import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { revalidatePath } from "next/cache";

export const deleteSideEffect = async (
  id: string,
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
  try {
    await db.cog_side_effect.delete({
      where: { id },
    });

    revalidatePath("/side-effect");

    return {
      success: "s-a sters",
    };
  } catch (error) {
    return catchError(error);
  }
};
