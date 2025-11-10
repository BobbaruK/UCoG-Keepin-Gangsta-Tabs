import { PAGINATION_DEFAULT } from "@/constants/table";
import { Prisma } from "@/generated/prisma";
import db from "@/lib/prisma";
import { Law, lawInclude } from "../types/law";

export const getLaws = async ({
  where,
  perPage,
  pageNumber,
  orderBy,
}: {
  where?: Prisma.cog_lawWhereInput;
  perPage?: number;
  pageNumber?: number;
  orderBy?: Prisma.cog_lawOrderByWithRelationInput;
} = {}) => {
  const pageSize = perPage || PAGINATION_DEFAULT;
  const skip = pageNumber ? pageNumber * pageSize : 0;

  try {
    const [data, count] = await db.$transaction([
      db.cog_law.findMany({
        ...(orderBy ? { orderBy } : {}),
        ...(where ? { where } : {}),
        skip,
        take: perPage && Math.sign(perPage) === 1 ? pageSize : undefined,
        include: lawInclude,
      }),
      db.cog_law.count(),
    ]);

    const laws = data as Law[];

    return { data: laws, count };
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};

export const getLaw = async (id: string) => {
  try {
    const law = await db.cog_law.findUnique({
      where: {
        id,
      },
      include: lawInclude,
    });

    return law;
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};
