import { Prisma } from "@/generated/prisma";

export const autoRouteInclude = {
  playthrough: {
    select: {
      is_finished: true,
    },
  },
  crew_member: {
    select: {
      id: true,
      first_name: true,
      last_name: true,
      alias: true,
      full_name: true,
    },
  },
  vehicle_type: {
    select: {
      id: true,
      name: true,
      capacity: true,
    },
  },
  route_type: {
    select: {
      id: true,
      name: true,
    },
  },
} satisfies Prisma.cog_auto_routeInclude;
