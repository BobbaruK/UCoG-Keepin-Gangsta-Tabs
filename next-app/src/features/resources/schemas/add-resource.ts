import { MAX_USERNAME, MIN_USERNAME } from "@/constants/misc";
import { ResourceCategory } from "@/generated/prisma";
import { z } from "zod";

export const AddResourceSchema = z.object({
  name: z
    .string()
    .min(MIN_USERNAME, {
      message: `Name must have ${MIN_USERNAME} or more characters.`,
    })
    .max(MAX_USERNAME, {
      message: `Name must have ${MAX_USERNAME} or fewer characters.`,
    }),
  image: z.string().optional(),
  category: z.enum([
    ResourceCategory.ALCOHOLS,
    ResourceCategory.INGREDIENTS,
    ResourceCategory.MATERIALS,
    ResourceCategory.OTHERS,
    ResourceCategory.WEAPONS,
  ]),
  price: z
    .number()
    .nonnegative({ error: "Price must be a non negative number." }),
  type: z.string(),
});
