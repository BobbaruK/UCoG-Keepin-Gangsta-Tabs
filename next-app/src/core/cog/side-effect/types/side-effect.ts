import { Prisma } from "@/generated/prisma";
import { sideEffectInclude } from "../constants/include";

export type SideEffect = Prisma.cog_side_effectGetPayload<{
  include: typeof sideEffectInclude;
}>;
