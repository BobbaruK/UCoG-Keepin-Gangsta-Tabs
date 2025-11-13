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
      freight_rail_station: true,
      passenger_rail_station: true,
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
} satisfies Prisma.cog_crew_memberInclude;

export type CrewMember = Prisma.cog_crew_memberGetPayload<{
  include: typeof crewMemberInclude;
}>;
