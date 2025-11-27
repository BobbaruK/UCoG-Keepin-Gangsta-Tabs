import { PAGINATION_DEFAULT } from "@/constants/table";
import { playthroughInclude } from "@/core/cog/playthrough/constants/include";
import { Playthrough } from "@/core/cog/playthrough/types/playthrough";
import { Prisma } from "@/generated/prisma";
import db from "@/lib/prisma";

export const getPlaythroughs = async ({
  where,
  perPage,
  pageNumber,
  orderBy,
}: {
  where?: Prisma.cog_playthroughWhereInput;
  perPage?: number;
  pageNumber?: number;
  orderBy?: Prisma.cog_playthroughOrderByWithRelationInput;
}) => {
  const pageSize = perPage || PAGINATION_DEFAULT;
  const skip = pageNumber ? pageNumber * pageSize : 0;

  try {
    const [data, count] = await db.$transaction([
      db.cog_playthrough.findMany({
        ...(orderBy ? { orderBy } : {}),
        ...(where ? { where } : {}),
        skip,
        take: perPage && Math.sign(perPage) === 1 ? pageSize : undefined,
        include: playthroughInclude,
      }),
      db.cog_playthrough.count({ ...(where ? { where } : {}) }),
    ]);

    const playthrough = data as Playthrough[];

    return { data: playthrough, count };
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};

export const getPlaythrough = async (id: string) => {
  try {
    const law = await db.cog_playthrough.findUnique({
      where: {
        id,
      },
      include: playthroughInclude,
    });

    return law;
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};
