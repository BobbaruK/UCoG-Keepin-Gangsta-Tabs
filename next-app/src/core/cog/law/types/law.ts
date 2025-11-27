import { Prisma } from "@/generated/prisma";
import { lawInclude } from "../constants/include";

export type Law = Prisma.cog_lawGetPayload<{
  include: typeof lawInclude;
}>;
