import { Prisma } from "@/generated/prisma";

export const gamblingBuildingInclude = {
  manager: {
    select: {
      id: true,
      first_name: true,
      last_name: true,
      alias: true,
      full_name: true,
      traits: {
        select: {
          id: true,
          name: true,
        },
      },
      experience: {
        select: {
          id: true,
          value: true,
          level: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  },
  playthrough: {
    select: {
      id: true,
      is_finished: true,
    },
  },
  gambling_building_size: {
    select: {
      id: true,
      name: true,
      max_features: true,
      is_dlc: true,
    },
  },
  features: {
    select: {
      id: true,
      name: true,
      type: true,
      weekly_cost: true,
      cash_on_hand: true,
    },
  },
} satisfies Prisma.cog_gambling_buildingInclude;
