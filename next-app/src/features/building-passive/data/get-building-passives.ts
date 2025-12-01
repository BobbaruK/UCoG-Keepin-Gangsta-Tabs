import { PAGINATION_DEFAULT } from "@/constants/table";
import { buildingPassiveInclude } from "@/core/cog/building-passive/constants/include";
import { BuildingPassive } from "@/core/cog/building-passive/types/building-passive-duration";
import { Prisma } from "@/generated/prisma";
import db from "@/lib/prisma";

export const getBuildingPassives = async ({
  where,
  perPage,
  pageNumber,
  orderBy,
}: {
  where?: Prisma.cog_building_passive_productionWhereInput;
  perPage?: number;
  pageNumber?: number;
  orderBy?: Prisma.cog_building_passive_productionOrderByWithRelationInput;
} = {}) => {
  const pageSize = perPage || PAGINATION_DEFAULT;
  const skip = pageNumber ? pageNumber * pageSize : 0;

  try {
    const [data, count] = await db.$transaction([
      db.cog_building_passive_production.findMany({
        ...(orderBy ? { orderBy } : {}),
        ...(where ? { where } : {}),
        skip,
        take: perPage && Math.sign(perPage) === 1 ? pageSize : undefined,
        include: buildingPassiveInclude,
      }),
      db.cog_building_passive_production.count({
        ...(where ? { where } : {}),
      }),
    ]);

    const buildingPassiveProduction = data as BuildingPassive[];

    return { data: buildingPassiveProduction, count };
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};

export const getBuildingPassive = async (id: string) => {
  try {
    const buildingPassiveProduction =
      await db.cog_building_passive_production.findUnique({
        where: {
          id,
        },
        include: buildingPassiveInclude,
      });

    return buildingPassiveProduction;
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};
