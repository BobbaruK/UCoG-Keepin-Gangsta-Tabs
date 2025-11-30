import { PAGINATION_DEFAULT } from "@/constants/table";
import { BuildingSize } from "@/core/cog/building-size/types/building-size";
import { Prisma } from "@/generated/prisma";
import db from "@/lib/prisma";

export const getBuildingSizes = async ({
  where,
  perPage,
  pageNumber,
  orderBy,
}: {
  where?: Prisma.cog_building_sizeWhereInput;
  perPage?: number;
  pageNumber?: number;
  orderBy?: Prisma.cog_building_sizeOrderByWithRelationInput;
} = {}) => {
  const pageSize = perPage || PAGINATION_DEFAULT;
  const skip = pageNumber ? pageNumber * pageSize : 0;

  try {
    const [data, count] = await db.$transaction([
      db.cog_building_size.findMany({
        ...(orderBy ? { orderBy } : {}),
        ...(where ? { where } : {}),
        skip,
        take: perPage && Math.sign(perPage) === 1 ? pageSize : undefined,
      }),
      db.cog_building_size.count({ ...(where ? { where } : {}) }),
    ]);

    const buildingSize = data as BuildingSize[];

    return { data: buildingSize, count };
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};

export const getBuildingSize = async (id: string) => {
  try {
    const buildingSize = await db.cog_building_size.findUnique({
      where: {
        id,
      },
    });

    return buildingSize;
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};
