import { MAX_USERNAME, MIN_USERNAME } from "@/constants/misc";
import { z } from "zod";

export const AddPlaythroughSchema = z.object({
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

  boss_first_name: z
    .string()
    .min(MIN_USERNAME, {
      message: `Crew member first name must have ${MIN_USERNAME} or more characters.`,
    })
    .max(MAX_USERNAME, {
      message: `Crew member first name must have ${MAX_USERNAME} or fewer characters.`,
    }),
  boss_last_name: z
    .string()
    .min(MIN_USERNAME, {
      message: `Crew member last name must have ${MIN_USERNAME} or more characters.`,
    })
    .max(MAX_USERNAME, {
      message: `Crew member last name must have ${MAX_USERNAME} or fewer characters.`,
    }),
  boss_nationality: z.string().nonempty({ error: "Select a nationality" }),
  boss_traits: z.array(z.string()).max(3, "Maximum 3 traits per crew member."),
});
