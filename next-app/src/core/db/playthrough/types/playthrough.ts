import { playthroughInclude } from "@/core/db/playthrough/constants/include";
import { Prisma } from "@/generated/prisma";

export type Playthrough = Prisma.cog_playthroughGetPayload<{
  include: typeof playthroughInclude;
}>;
