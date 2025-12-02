import { PAGINATION_DEFAULT } from "@/constants/table";
import { GamblingSize } from "@/core/cog/gambling-size/types/gambling-size";
import { Prisma } from "@/generated/prisma";
import db from "@/lib/prisma";

export const getGamblingSizes = async ({
  where,
  perPage,
  pageNumber,
  orderBy,
}: {
  where?: Prisma.cog_gambling_sizeWhereInput;
  perPage?: number;
  pageNumber?: number;
  orderBy?: Prisma.cog_gambling_sizeOrderByWithRelationInput;
} = {}) => {
  const pageSize = perPage || PAGINATION_DEFAULT;
  const skip = pageNumber ? pageNumber * pageSize : 0;

  try {
    const [data, count] = await db.$transaction([
      db.cog_gambling_size.findMany({
        ...(orderBy ? { orderBy } : {}),
        ...(where ? { where } : {}),
        skip,
        take: perPage && Math.sign(perPage) === 1 ? pageSize : undefined,
      }),
      db.cog_gambling_size.count(),
    ]);

    const gamblingSizes = data as GamblingSize[];

    return { data: gamblingSizes, count };
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};

export const getGamblingSize = async (id: string) => {
  try {
    const law = await db.cog_gambling_size.findUnique({
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
