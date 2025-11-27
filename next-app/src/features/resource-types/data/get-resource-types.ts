import { PAGINATION_DEFAULT } from "@/constants/table";
import { resourceTypeInclude } from "@/core/cog/resource-type/constants/include";
import { ResourceType } from "@/core/cog/resource-type/types/resource-type";
import { Prisma } from "@/generated/prisma";
import db from "@/lib/prisma";

export const getResourceTypes = async ({
  where,
  perPage,
  pageNumber,
  orderBy,
}: {
  where?: Prisma.cog_resource_typeWhereInput;
  perPage?: number;
  pageNumber?: number;
  orderBy?: Prisma.cog_resource_typeOrderByWithRelationInput;
}) => {
  const pageSize = perPage || PAGINATION_DEFAULT;
  const skip = pageNumber ? pageNumber * pageSize : 0;

  try {
    const [data, count] = await db.$transaction([
      db.cog_resource_type.findMany({
        ...(orderBy ? { orderBy } : {}),
        ...(where ? { where } : {}),
        skip,
        take: perPage && Math.sign(perPage) === 1 ? pageSize : undefined,
        include: resourceTypeInclude,
      }),
      db.cog_resource_type.count(),
    ]);

    const resourceTypes = data as ResourceType[];

    return { data: resourceTypes, count };
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};

export const getResourceType = async (id: string) => {
  try {
    const resourceType = await db.cog_resource_type.findUnique({
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
