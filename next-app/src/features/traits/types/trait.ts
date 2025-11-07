import { Prisma } from "@/generated/prisma";

export type Trait = Prisma.cog_traitGetPayload<{
  include: {
    sideEffect: {
      select: {
        id: true;
        name: true;
        type: true;
        value: true;
      };
    };
  };
}>;
