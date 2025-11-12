import { PAGINATION_DEFAULT } from "@/constants/table";
import { Prisma } from "@/generated/prisma";
import db from "@/lib/prisma";
import { CaptainRole, captainRoleInclude } from "../types/roles";

export const getCaptainRoles = async ({
  where,
  perPage,
  pageNumber,
  orderBy,
}: {
  where?: Prisma.cog_captain_roleWhereInput;
  perPage?: number;
  pageNumber?: number;
  orderBy?: Prisma.cog_captain_roleOrderByWithRelationInput;
} = {}) => {
  const pageSize = perPage || PAGINATION_DEFAULT;
  const skip = pageNumber ? pageNumber * pageSize : 0;

  try {
    const [data, count] = await db.$transaction([
      db.cog_captain_role.findMany({
        ...(orderBy ? { orderBy } : {}),
        ...(where ? { where } : {}),
        skip,
        take: perPage && Math.sign(perPage) === 1 ? pageSize : undefined,
        include: captainRoleInclude,
      }),
      db.cog_captain_role.count({ ...(where ? { where } : {}) }),
    ]);

    const resourceTypes = data as CaptainRole[];

    return { data: resourceTypes, count };
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};

export const getCaptainRole = async (id: string) => {
  try {
    const resourceType = await db.cog_captain_role.findUnique({
      where: {
        id,
      },
      include: captainRoleInclude,
    });

    return resourceType;
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};
