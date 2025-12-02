import { MAX_USERNAME, MIN_USERNAME } from "@/constants/misc";
import { GamblingFeatureType, LawType } from "@/generated/prisma";
import { NONNEGATIVE_NUMBER } from "@/schemas/form/number";
import { z } from "zod";

export const AddGamblingFeatureSchema = z.object({
  name: z
    .string()
    .min(MIN_USERNAME, {
      message: `Name must have ${MIN_USERNAME} or more characters.`,
    })
    .max(MAX_USERNAME, {
      message: `Name must have ${MAX_USERNAME} or fewer characters.`,
    }),
  weekly_cost: NONNEGATIVE_NUMBER("Weekly cost"),
  cash_on_hand: NONNEGATIVE_NUMBER("Cash on hand"),
  is_dlc: z.boolean(),
  type: z.enum([
    GamblingFeatureType.ENHANCED,
    GamblingFeatureType.OCCASIONAL,
    GamblingFeatureType.REGULAR,
  ]),
});
