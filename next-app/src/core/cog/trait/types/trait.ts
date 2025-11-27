import { Prisma } from "@/generated/prisma";
import { traitInclude } from "../constants/include";

export type Trait = Prisma.cog_traitGetPayload<{
  include: typeof traitInclude;
}>;
