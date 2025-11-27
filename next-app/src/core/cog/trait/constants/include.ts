import { Prisma } from "@/generated/prisma";

export const traitInclude = {
  sideEffect: {
    select: {
      id: true,
      name: true,
      type: true,
      value: true,
    },
  },
} satisfies Prisma.cog_traitInclude;
