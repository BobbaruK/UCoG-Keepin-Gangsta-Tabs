import { MAX_USERNAME, MIN_USERNAME } from "@/constants/misc";
import { CrewLevelType } from "@/generated/prisma";
import { z } from "zod";

export const AddCrewLevelSchema = z.object({
  name: z
    .string()
    .min(MIN_USERNAME, {
      message: `Name must have ${MIN_USERNAME} or more characters.`,
    })
    .max(MAX_USERNAME, {
      message: `Name must have ${MAX_USERNAME} or fewer characters.`,
    }),
  description: z.string().optional(),
  maxLevel: z.number(),
  type: z.enum([
    CrewLevelType.DRIVER,
    CrewLevelType.GAMBLING,
    CrewLevelType.GENERAL,
    CrewLevelType.PRODUCTION,
    CrewLevelType.SPEAKEASY,
  ]),
});
