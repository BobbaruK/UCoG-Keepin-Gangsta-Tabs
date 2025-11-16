import { MAX_USERNAME, MIN_USERNAME } from "@/constants/misc";
import { z } from "zod";

export const AddCrewMemberSchema = z.object({
  first_name: z
    .string()
    .min(MIN_USERNAME, {
      message: `First name must have ${MIN_USERNAME} or more characters.`,
    })
    .max(MAX_USERNAME, {
      message: `First name must have ${MAX_USERNAME} or fewer characters.`,
    }),
  last_name: z
    .string()
    .min(MIN_USERNAME, {
      message: `Last name must have ${MIN_USERNAME} or more characters.`,
    })
    .max(MAX_USERNAME, {
      message: `Last name must have ${MAX_USERNAME} or fewer characters.`,
    }),
  alias: z.string().optional(),
  isDead: z.boolean(),
  turn_recruited: z.number(),
  captain_role: z.string().optional(),
  nationality: z.string().nonempty({ error: "Select a nationality" }),
  traits: z.array(z.string()).max(3, "Maximum 3 traits per crew member."),
});
