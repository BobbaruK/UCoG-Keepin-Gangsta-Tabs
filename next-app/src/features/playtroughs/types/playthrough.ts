import { Prisma } from "@/generated/prisma";

export const playthroughInclude: Prisma.cog_playthroughInclude = {
  laws: {
    select: {
      id: true,
      name: true,
      type: true,
      sideEffect: {
        select: {
          id: true,
          name: true,
          type: true,
          value: true,
        },
      },
    },
  },
  user: {
    select: {
      slug: true,
      displayUsername: true,
      image: true,
      banned: true,
    },
  },
};

export type Playthrough = Prisma.cog_playthroughGetPayload<{
  include: typeof playthroughInclude;
}>;
