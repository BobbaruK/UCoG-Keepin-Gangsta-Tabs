import { PAGINATION_DEFAULT } from "@/constants/table";
import { traitInclude } from "@/core/db/trait/constants/include";
import { Trait } from "@/core/db/trait/types/trait";
import { Prisma } from "@/generated/prisma";
import db from "@/lib/prisma";

export const getTraits = async ({
  where,
  perPage,
  pageNumber,
  orderBy,
}: {
  where?: Prisma.cog_traitWhereInput;
  perPage?: number;
  pageNumber?: number;
  orderBy?: Prisma.cog_traitOrderByWithRelationInput;
} = {}) => {
  const pageSize = perPage || PAGINATION_DEFAULT;
  const skip = pageNumber ? pageNumber * pageSize : 0;

  try {
    const [data, count] = await db.$transaction([
      db.cog_trait.findMany({
        ...(orderBy ? { orderBy } : {}),
        ...(where ? { where } : {}),
        skip,
        take: perPage && Math.sign(perPage) === 1 ? pageSize : undefined,
        include: traitInclude,
      }),
      db.cog_trait.count(),
    ]);

    const traits = data as Trait[];

    return { data: traits, count };
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};

export const getTrait = async (id: string) => {
  try {
    const trait = await db.cog_trait.findUnique({
      where: {
        id,
      },
      include: traitInclude,
    });

    return trait;
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};
