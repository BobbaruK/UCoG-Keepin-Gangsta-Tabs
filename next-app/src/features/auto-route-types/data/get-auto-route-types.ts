import { PAGINATION_DEFAULT } from "@/constants/table";
import { AutoRouteType } from "@/core/cog/auto-route-type/types/auto-route-type";
import { Prisma } from "@/generated/prisma";
import db from "@/lib/prisma";

export const getAutoRouteTypes = async ({
  where,
  perPage,
  pageNumber,
  orderBy,
}: {
  where?: Prisma.cog_auto_route_typeWhereInput;
  perPage?: number;
  pageNumber?: number;
  orderBy?: Prisma.cog_auto_route_typeOrderByWithRelationInput;
} = {}) => {
  const pageSize = perPage || PAGINATION_DEFAULT;
  const skip = pageNumber ? pageNumber * pageSize : 0;

  try {
    const [data, count] = await db.$transaction([
      db.cog_auto_route_type.findMany({
        ...(orderBy ? { orderBy } : {}),
        ...(where ? { where } : {}),
        skip,
        take: perPage && Math.sign(perPage) === 1 ? pageSize : undefined,
      }),
      db.cog_auto_route_type.count({ ...(where ? { where } : {}) }),
    ]);

    const autoRouteTypes = data as AutoRouteType[];

    return { data: autoRouteTypes, count };
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};

export const getAutoRouteType = async (id: string) => {
  try {
    const resourceType = await db.cog_auto_route_type.findUnique({
      where: {
        id,
      },
    });

    return resourceType;
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};
