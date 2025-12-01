import { PAGINATION_DEFAULT } from "@/constants/table";
import { buildingInclude } from "@/core/cog/building/constants/include";
import { Building } from "@/core/cog/building/types/building";
import { Prisma } from "@/generated/prisma";
import db from "@/lib/prisma";

export const getBuildings = async ({
  where,
  perPage,
  pageNumber,
  orderBy,
}: {
  where?: Prisma.cog_buildingWhereInput;
  perPage?: number;
  pageNumber?: number;
  orderBy?: Prisma.cog_buildingOrderByWithRelationInput;
} = {}) => {
  const pageSize = perPage || PAGINATION_DEFAULT;
  const skip = pageNumber ? pageNumber * pageSize : 0;

  try {
    const [data, count] = await db.$transaction([
      db.cog_building.findMany({
        ...(orderBy ? { orderBy } : {}),
        ...(where ? { where } : {}),
        skip,
        take: perPage && Math.sign(perPage) === 1 ? pageSize : undefined,
        include: buildingInclude,
      }),
      db.cog_building.count({
        ...(where ? { where } : {}),
      }),
    ]);

    const building = data as Building[];

    return { data: building, count };
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};

export const getBuilding = async (id: string) => {
  try {
    const law = await db.cog_building.findUnique({
      where: {
        id,
      },
      include: buildingInclude,
    });

    return law;
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};
