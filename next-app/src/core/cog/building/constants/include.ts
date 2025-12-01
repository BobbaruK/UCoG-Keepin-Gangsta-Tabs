import { Prisma } from "@/generated/prisma";

export const buildingInclude = {
  playthrough: {
    select: {
      id: true,
      is_finished: true,
    },
  },
  size: {
    select: {
      id: true,
      capacity: true,
      name: true,
    },
  },
  type: {
    select: {
      id: true,
      name: true,
    },
  },
  backroom: {
    select: {
      id: true,
      name: true,
    },
  },
  manager: {
    select: {
      id: true,
      first_name: true,
      last_name: true,
      alias: true,
      full_name: true,
    },
  },
  passive_productions_duration: {
    select: {
      id: true,
      turns: true,
    },
  },
  passive_productions: {
    select: {
      id: true,
      quantity: true,
      resource: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  },
} satisfies Prisma.cog_buildingInclude;
