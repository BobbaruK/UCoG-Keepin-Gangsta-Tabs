import { PAGINATION_DEFAULT } from "@/constants/table";
import { CrewLevel } from "@/core/db/crew-level/types/crew-level";
import { Prisma } from "@/generated/prisma";
import db from "@/lib/prisma";

export const getCrewLevels = async ({
  where,
  perPage,
  pageNumber,
  orderBy,
}: {
  where?: Prisma.cog_crew_levelWhereInput;
  perPage?: number;
  pageNumber?: number;
  orderBy?: Prisma.cog_crew_levelOrderByWithRelationInput;
} = {}) => {
  const pageSize = perPage || PAGINATION_DEFAULT;
  const skip = pageNumber ? pageNumber * pageSize : 0;

  try {
    const [data, count] = await db.$transaction([
      db.cog_crew_level.findMany({
        ...(orderBy ? { orderBy } : {}),
        ...(where ? { where } : {}),
        skip,
        take: perPage && Math.sign(perPage) === 1 ? pageSize : undefined,
      }),
      db.cog_crew_level.count({ ...(where ? { where } : {}) }),
    ]);

    const crewLevels = data as CrewLevel[];

    return { data: crewLevels, count };
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};
