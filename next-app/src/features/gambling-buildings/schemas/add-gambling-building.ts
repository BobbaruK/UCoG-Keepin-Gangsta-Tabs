import { MAX_USERNAME, MIN_USERNAME } from "@/constants/misc";
import { z } from "zod";

export const AddGamblingBuildingSchema = z.object({
  name: z
    .string()
    .min(MIN_USERNAME, {
      message: `Name must have ${MIN_USERNAME} or more characters.`,
    })
    .max(MAX_USERNAME, {
      message: `Name must have ${MAX_USERNAME} or fewer characters.`,
    }),
  gambling_building_size: z.string(),
  manager: z.string(),
  features: z
    .array(z.string())
    .max(12, "Maximum 12 features in Atlantic City DLC."),
});
