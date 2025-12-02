import { PAGINATION_DEFAULT } from "@/constants/table";
import { GamblingFeature } from "@/core/cog/gambling-feature/types/gambling-feature";
import { Prisma } from "@/generated/prisma";
import db from "@/lib/prisma";

export const getGamblingFeatures = async ({
  where,
  perPage,
  pageNumber,
  orderBy,
}: {
  where?: Prisma.cog_gambling_featureWhereInput;
  perPage?: number;
  pageNumber?: number;
  orderBy?: Prisma.cog_gambling_featureOrderByWithRelationInput;
} = {}) => {
  const pageSize = perPage || PAGINATION_DEFAULT;
  const skip = pageNumber ? pageNumber * pageSize : 0;

  try {
    const [data, count] = await db.$transaction([
      db.cog_gambling_feature.findMany({
        ...(orderBy ? { orderBy } : {}),
        ...(where ? { where } : {}),
        skip,
        take: perPage && Math.sign(perPage) === 1 ? pageSize : undefined,
      }),
      db.cog_gambling_feature.count(),
    ]);

    const gamblingSizes = data as GamblingFeature[];

    return { data: gamblingSizes, count };
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};

export const getGamblingFeature = async (id: string) => {
  try {
    const law = await db.cog_gambling_feature.findUnique({
      where: {
        id,
      },
    });

    return law;
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};
