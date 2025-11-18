import { MAX_USERNAME, MIN_USERNAME } from "@/constants/misc";
import { z } from "zod";

export const EditPlaythroughSchema = z.object({
  name: z
    .string()
    .min(MIN_USERNAME, {
      message: `Name must have ${MIN_USERNAME} or more characters.`,
    })
    .max(MAX_USERNAME, {
      message: `Name must have ${MAX_USERNAME} or fewer characters.`,
    }),
  seed: z.string().optional(),
  isPublic: z.boolean(),
  passengerRailStation: z.boolean(),
  freightRailStation: z.boolean(),
  respectForTheLaw: z.boolean(),
  laws: z.array(z.string()),
});
