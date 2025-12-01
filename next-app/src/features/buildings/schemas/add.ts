import { MAX_USERNAME, MIN_USERNAME } from "@/constants/misc";
import { z } from "zod";

export const AddBuildingSchema = z.object({
  name: z
    .string()
    .min(MIN_USERNAME, {
      message: `Name must have ${MIN_USERNAME} or more characters.`,
    })
    .max(MAX_USERNAME, {
      message: `Name must have ${MAX_USERNAME} or fewer characters.`,
    }),
  manager: z.string().optional(),
  type: z.string().optional(),
  size: z.string().nonempty({ error: "Please select a size." }),
  passive_productions: z
    .array(z.string())
    .max(
      3,
      "Contact the administrator if you have seen more than 3 resources on passive production",
    ),
  passive_production_duration: z.string().optional(),
  backroom: z.string().optional(),
});
