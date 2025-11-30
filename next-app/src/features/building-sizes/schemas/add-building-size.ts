import { MAX_USERNAME, MIN_USERNAME } from "@/constants/misc";
import { NONNEGATIVE_NUMBER } from "@/schemas/form/number";
import { z } from "zod";

export const AddBuildingSizeSchema = z.object({
  name: z
    .string()
    .min(MIN_USERNAME, {
      message: `Name must have ${MIN_USERNAME} or more characters.`,
    })
    .max(MAX_USERNAME, {
      message: `Name must have ${MAX_USERNAME} or fewer characters.`,
    }),
  capacity: NONNEGATIVE_NUMBER("Capacity"),
});
