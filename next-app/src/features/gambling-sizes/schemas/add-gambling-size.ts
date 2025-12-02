import { MAX_USERNAME, MIN_USERNAME } from "@/constants/misc";
import { LawType } from "@/generated/prisma";
import { NONNEGATIVE_NUMBER } from "@/schemas/form/number";
import { z } from "zod";

export const AddGamblingSizeSchema = z.object({
  name: z
    .string()
    .min(MIN_USERNAME, {
      message: `Name must have ${MIN_USERNAME} or more characters.`,
    })
    .max(MAX_USERNAME, {
      message: `Name must have ${MAX_USERNAME} or fewer characters.`,
    }),
  max_features: NONNEGATIVE_NUMBER("Features"),
  is_dlc: z.boolean(),
});
