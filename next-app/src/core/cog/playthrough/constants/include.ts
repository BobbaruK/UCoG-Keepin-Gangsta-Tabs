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
  crew_members: {
    include: {
      cogBuildings: true,
    },
  },
  police_officers: true,
  auto_routes: true,
  buildings: {
    select: {
      id: true,
      name: true,
      backroom_id: true,
      size: {
        select: {
          id: true,
          name: true,
          capacity: true,
        },
      },
    },
  },
} satisfies Prisma.cog_playthroughInclude;
