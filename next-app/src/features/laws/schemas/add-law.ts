import { MAX_USERNAME, MIN_USERNAME } from "@/constants/misc";
import { LawType } from "@/generated/prisma";
import { z } from "zod";

export const AddLawSchema = z.object({
  name: z
    .string()
    .min(MIN_USERNAME, {
      message: `Name must have ${MIN_USERNAME} or more characters.`,
    })
    .max(MAX_USERNAME, {
      message: `Name must have ${MAX_USERNAME} or fewer characters.`,
    }),
  enact: z.number(),
  revoke: z.number(),
  type: z.enum([LawType.PERMANENT, LawType.TEMPORARY]),
  description: z.string().optional(),
  sideEffect: z.string().optional(),
});
