import { MAX_USERNAME, MIN_USERNAME } from "@/constants/misc";
import { SideEffectType } from "@/generated/prisma";
import { z } from "zod";

export const SideEffectSchema = z.object({
  name: z
    .string()
    .min(MIN_USERNAME, {
      message: `Name must have ${MIN_USERNAME} or more characters.`,
    })
    .max(MAX_USERNAME, {
      message: `Name must have ${MAX_USERNAME} or fewer characters.`,
    }),
  description: z.string().optional(),
  type: z.enum([SideEffectType.ACTION, SideEffectType.MOVEMENT]),
  value: z.number(),
});
