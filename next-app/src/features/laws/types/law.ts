import { Prisma } from "@/generated/prisma";

export const lawInclude: Prisma.cog_lawInclude = {
  sideEffect: {
    select: {
      id: true,
      name: true,
      type: true,
      value: true,
    },
  },
};

export type Law = Prisma.cog_lawGetPayload<{
  include: typeof lawInclude;
}>;
