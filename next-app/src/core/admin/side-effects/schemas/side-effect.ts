import { SideEffectType } from "@/generated/prisma";
import { z } from "zod";
import { DESCRIPTION, NAME, VALUE } from "./partials";

export const SideEffectSchema = z.object({
  name: NAME,
  description: DESCRIPTION,
  type: z.enum([SideEffectType.ACTION, SideEffectType.MOVEMENT]),
  value: VALUE,
});
