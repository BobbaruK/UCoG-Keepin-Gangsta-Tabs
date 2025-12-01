import { Prisma } from "@/generated/prisma";

export const buildingPassiveInclude = {
  resource: {
    select: {
      id: true,
      name: true,
      image: true,
    },
  },
} satisfies Prisma.cog_building_passive_productionInclude;
