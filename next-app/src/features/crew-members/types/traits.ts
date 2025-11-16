import { Prisma } from "@/generated/prisma";
import { traitInclude } from "@/lib/utils/db/trait-include";

export type Trait = Prisma.cog_traitGetPayload<{
  include: typeof traitInclude;
}>;
