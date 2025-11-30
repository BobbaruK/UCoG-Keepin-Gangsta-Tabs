import { PAGINATION_DEFAULT } from "@/constants/table";
import { BuildingBackroom } from "@/core/cog/building-backroom/types/building-backroom";
import { Prisma } from "@/generated/prisma";
import db from "@/lib/prisma";

export const getBuildingBackrooms = async ({
  where,
  perPage,
  pageNumber,
  orderBy,
}: {
  where?: Prisma.cog_building_backroomWhereInput;
  perPage?: number;
  pageNumber?: number;
  orderBy?: Prisma.cog_building_backroomOrderByWithRelationInput;
} = {}) => {
  const pageSize = perPage || PAGINATION_DEFAULT;
  const skip = pageNumber ? pageNumber * pageSize : 0;

  try {
    const [data, count] = await db.$transaction([
      db.cog_building_backroom.findMany({
        ...(orderBy ? { orderBy } : {}),
        ...(where ? { where } : {}),
        skip,
        take: perPage && Math.sign(perPage) === 1 ? pageSize : undefined,
      }),
      db.cog_building_backroom.count({ ...(where ? { where } : {}) }),
    ]);

    const buildingBackroom = data as BuildingBackroom[];

    return { data: buildingBackroom, count };
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};

export const getBuildingBackroom = async (id: string) => {
  try {
    const buildingBackroom = await db.cog_building_backroom.findUnique({
      where: {
        id,
      },
    });

    return buildingBackroom;
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};
