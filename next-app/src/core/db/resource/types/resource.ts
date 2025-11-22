import { Prisma } from "@/generated/prisma";
import { resourceInclude } from "../constants/include";

export type Resource = Prisma.cog_resourceGetPayload<{
  include: typeof resourceInclude;
}>;
