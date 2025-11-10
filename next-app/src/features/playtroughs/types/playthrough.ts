import { Prisma } from "@/generated/prisma";

export const playthroughInclude = {
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
} satisfies Prisma.cog_playthroughInclude;

export type Playthrough = Prisma.cog_playthroughGetPayload<{
  include: typeof playthroughInclude;
}>;
