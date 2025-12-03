import { Prisma } from "@/generated/prisma";
import { gamblingBuildingInclude } from "../../gambling-building/constants/include";

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
  gambling_buildings: {
    // select: {
    //   id: true,
    //   name: true,
    //   features: {
    //     select: {
    //       id: true,
    //       name: true,
    //       weekly_cost: true,
    //       cash_on_hand: true,
    //     },
    //   },
    // },
    include: gamblingBuildingInclude,
  },
} satisfies Prisma.cog_playthroughInclude;
