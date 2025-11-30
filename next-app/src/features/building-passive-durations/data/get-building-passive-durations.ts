import { PAGINATION_DEFAULT } from "@/constants/table";
import { BuildingPassiveDuration } from "@/core/cog/building-passive-duration/types/building-passive-duration";
import { Prisma } from "@/generated/prisma";
import db from "@/lib/prisma";

export const getBuildingPassiveDurations = async ({
  where,
  perPage,
  pageNumber,
  orderBy,
}: {
  where?: Prisma.cog_building_passive_production_durationWhereInput;
  perPage?: number;
  pageNumber?: number;
  orderBy?: Prisma.cog_building_passive_production_durationOrderByWithRelationInput;
} = {}) => {
  const pageSize = perPage || PAGINATION_DEFAULT;
  const skip = pageNumber ? pageNumber * pageSize : 0;

  try {
    const [data, count] = await db.$transaction([
      db.cog_building_passive_production_duration.findMany({
        ...(orderBy ? { orderBy } : {}),
        ...(where ? { where } : {}),
        skip,
        take: perPage && Math.sign(perPage) === 1 ? pageSize : undefined,
      }),
      db.cog_building_passive_production_duration.count({
        ...(where ? { where } : {}),
      }),
    ]);

    const buildingSize = data as BuildingPassiveDuration[];

    return { data: buildingSize, count };
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};

export const getBuildingPassiveDuration = async (id: string) => {
  try {
    const buildingSize =
      await db.cog_building_passive_production_duration.findUnique({
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
