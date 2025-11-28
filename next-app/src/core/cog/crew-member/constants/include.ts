import { Prisma } from "@/generated/prisma";

export const crewMemberInclude = {
  traits: {
    select: {
      id: true,
      name: true,
      image: true,
      sideEffect: {
        select: {
          value: true,
          type: true,
        },
      },
    },
  },
  captain: {
    select: {
      id: true,
      name: true,
      image: true,
      sideEffect: {
        select: {
          value: true,
          type: true,
        },
      },
    },
  },
  nationality: {
    select: {
      id: true,
      name: true,
      flag: true,
    },
  },
  playthrough: {
    select: {
      id: true,
      freight_rail_station: true,
      passenger_rail_station: true,
      is_finished: true,
      laws: {
        select: {
          name: true,
          id: true,
          sideEffect: {
            select: {
              value: true,
              type: true,
            },
          },
        },
      },
    },
  },
  experience: {
    select: {
      id: true,
      value: true,
      level: {
        select: {
          id: true,
          type: true,
          name: true,
          max_level: true,
        },
      },
    },
  },
  cogAutoRoute: true,
} satisfies Prisma.cog_crew_memberInclude;
