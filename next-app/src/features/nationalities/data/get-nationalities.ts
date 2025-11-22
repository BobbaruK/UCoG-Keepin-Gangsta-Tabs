import { PAGINATION_DEFAULT } from "@/constants/table";
import { Nationality } from "@/core/db/nationality/types/nationality";
import { Prisma } from "@/generated/prisma";
import db from "@/lib/prisma";

export const getNationalities = async ({
  where,
  perPage,
  pageNumber,
  orderBy,
}: {
  where?: Prisma.cog_nationalityWhereInput;
  perPage?: number;
  pageNumber?: number;
  orderBy?: Prisma.cog_nationalityOrderByWithRelationInput;
} = {}) => {
  const pageSize = perPage || PAGINATION_DEFAULT;
  const skip = pageNumber ? pageNumber * pageSize : 0;

  try {
    const [data, count] = await db.$transaction([
      db.cog_nationality.findMany({
        ...(orderBy ? { orderBy } : {}),
        ...(where ? { where } : {}),
        skip,
        take: perPage && Math.sign(perPage) === 1 ? pageSize : undefined,
      }),
      db.cog_nationality.count(),
    ]);

    const nationalities = data as Nationality[];

    return { data: nationalities, count };
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};

export const getNationality = async (id: string) => {
  try {
    const law = await db.cog_nationality.findUnique({
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
