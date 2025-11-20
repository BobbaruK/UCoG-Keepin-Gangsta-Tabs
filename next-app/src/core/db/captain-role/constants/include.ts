import { Prisma } from "@/generated/prisma";

export const captainRoleInclude: Prisma.cog_captain_roleInclude = {
  sideEffect: {
    select: {
      id: true,
      name: true,
      value: true,
    },
  },
};
