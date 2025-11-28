import { PAGINATION_DEFAULT } from "@/constants/table";
import { autoRouteInclude } from "@/core/cog/auto-route/constants/include";
import { AutoRoute } from "@/core/cog/auto-route/types/auto-route";
import { Prisma } from "@/generated/prisma";
import db from "@/lib/prisma";

export const getAutoRoutes = async ({
  where,
  perPage,
  pageNumber,
  orderBy,
}: {
  where?: Prisma.cog_auto_routeWhereInput;
  perPage?: number;
  pageNumber?: number;
  orderBy?: Prisma.cog_auto_routeOrderByWithRelationInput;
}) => {
  const pageSize = perPage || PAGINATION_DEFAULT;
  const skip = pageNumber ? pageNumber * pageSize : 0;

  try {
    const [data, count] = await db.$transaction([
      db.cog_auto_route.findMany({
        ...(orderBy ? { orderBy } : {}),
        ...(where ? { where } : {}),
        skip,
        take: perPage && Math.sign(perPage) === 1 ? pageSize : undefined,
        include: autoRouteInclude,
      }),
      db.cog_auto_route.count({ ...(where ? { where } : {}) }),
    ]);

    const autoRoute = data as AutoRoute[];

    return { data: autoRoute, count };
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};

export const getAutoRoute = async (id: string) => {
  try {
    const law = await db.cog_auto_route.findUnique({
      where: {
        id,
      },
      include: autoRouteInclude,
    });

    return law;
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};
