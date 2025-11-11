import { MAX_USERNAME, MIN_USERNAME } from "@/constants/misc";
import { z } from "zod";

export const AddPoliceOfficerSchema = z.object({
  name: z
    .string()
    .min(MIN_USERNAME, {
      message: `Name must have ${MIN_USERNAME} or more characters.`,
    })
    .max(MAX_USERNAME, {
      message: `Name must have ${MAX_USERNAME} or fewer characters.`,
    }),
  bribedTurn: z.number(),
  has_rival_hooligan_relative: z.boolean(),
  political_contact_used: z.boolean(),
  can_call_in_a_raid: z.boolean(),
});
