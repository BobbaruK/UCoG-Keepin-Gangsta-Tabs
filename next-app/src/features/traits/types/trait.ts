import { Prisma } from "@/generated/prisma";

export const traitInclude: Prisma.cog_traitInclude = {
  sideEffect: {
    select: {
      id: true,
      name: true,
      type: true,
      value: true,
    },
  },
};

export type Trait = Prisma.cog_traitGetPayload<{
  include: typeof traitInclude;
}>;
