import { PAGINATION_DEFAULT } from "@/constants/table";
import { BuildingType } from "@/core/cog/building-type/types/building-type";
import { Prisma } from "@/generated/prisma";
import db from "@/lib/prisma";

export const getBuildingTypes = async ({
  where,
  perPage,
  pageNumber,
  orderBy,
}: {
  where?: Prisma.cog_building_typeWhereInput;
  perPage?: number;
  pageNumber?: number;
  orderBy?: Prisma.cog_building_typeOrderByWithRelationInput;
} = {}) => {
  const pageSize = perPage || PAGINATION_DEFAULT;
  const skip = pageNumber ? pageNumber * pageSize : 0;

  try {
    const [data, count] = await db.$transaction([
      db.cog_building_type.findMany({
        ...(orderBy ? { orderBy } : {}),
        ...(where ? { where } : {}),
        skip,
        take: perPage && Math.sign(perPage) === 1 ? pageSize : undefined,
      }),
      db.cog_building_type.count({ ...(where ? { where } : {}) }),
    ]);

    const buildingTypes = data as BuildingType[];

    return { data: buildingTypes, count };
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};

export const getBuildingType = async (id: string) => {
  try {
    const buildingType = await db.cog_building_type.findUnique({
      where: {
        id,
      },
    });

    return buildingType;
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};
