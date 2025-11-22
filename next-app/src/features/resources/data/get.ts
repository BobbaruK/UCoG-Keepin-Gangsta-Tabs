import { PAGINATION_DEFAULT } from "@/constants/table";
import { resourceInclude } from "@/core/db/resource/constants/include";
import { Resource } from "@/core/db/resource/types/resource";
import { Prisma } from "@/generated/prisma";
import db from "@/lib/prisma";

export const getResources = async ({
  where,
  perPage,
  pageNumber,
  orderBy,
}: {
  where?: Prisma.cog_resourceWhereInput;
  perPage?: number;
  pageNumber?: number;
  orderBy?: Prisma.cog_resourceOrderByWithRelationInput;
} = {}) => {
  const pageSize = perPage || PAGINATION_DEFAULT;
  const skip = pageNumber ? pageNumber * pageSize : 0;

  try {
    const [data, count] = await db.$transaction([
      db.cog_resource.findMany({
        ...(orderBy ? { orderBy } : {}),
        ...(where ? { where } : {}),
        skip,
        take: perPage && Math.sign(perPage) === 1 ? pageSize : undefined,
        include: resourceInclude,
      }),
      db.cog_resource.count(),
    ]);

    const resourceTypes = data as Resource[];

    return { data: resourceTypes, count };
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};

export const getResource = async (id: string) => {
  try {
    const resourceType = await db.cog_resource.findUnique({
      where: {
        id,
      },
      include: resourceInclude,
    });

    return resourceType;
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};
