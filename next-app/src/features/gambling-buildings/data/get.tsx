import { PAGINATION_DEFAULT } from "@/constants/table";
import { gamblingBuildingInclude } from "@/core/cog/gambling-building/constants/include";
import { GamblingBuilding } from "@/core/cog/gambling-building/types/gambling-building";
import { Prisma } from "@/generated/prisma";
import db from "@/lib/prisma";

export const getGamblingBuildings = async ({
  where,
  perPage,
  pageNumber,
  orderBy,
}: {
  where?: Prisma.cog_gambling_buildingWhereInput;
  perPage?: number;
  pageNumber?: number;
  orderBy?: Prisma.cog_gambling_buildingOrderByWithRelationInput;
} = {}) => {
  const pageSize = perPage || PAGINATION_DEFAULT;
  const skip = pageNumber ? pageNumber * pageSize : 0;

  try {
    const [data, count] = await db.$transaction([
      db.cog_gambling_building.findMany({
        ...(orderBy ? { orderBy } : {}),
        ...(where ? { where } : {}),
        skip,
        take: perPage && Math.sign(perPage) === 1 ? pageSize : undefined,
        include: gamblingBuildingInclude,
      }),
      db.cog_gambling_building.count({
        ...(where ? { where } : {}),
      }),
    ]);

    const gamblingBuildings = data as GamblingBuilding[];

    return { data: gamblingBuildings, count };
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};

export const getGamblingBuilding = async (id: string) => {
  try {
    const law = await db.cog_gambling_building.findUnique({
      where: {
        id,
      },
      include: gamblingBuildingInclude,
    });

    return law;
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};
