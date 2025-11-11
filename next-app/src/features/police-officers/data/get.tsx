import { PAGINATION_DEFAULT } from "@/constants/table";
import { Prisma } from "@/generated/prisma";
import db from "@/lib/prisma";
import { PoliceOfficer } from "../types/police-officer";

export const getPoliceOfficers = async ({
  where,
  perPage,
  pageNumber,
  orderBy,
}: {
  where?: Prisma.cog_police_officerWhereInput;
  perPage?: number;
  pageNumber?: number;
  orderBy?: Prisma.cog_police_officerOrderByWithRelationInput;
} = {}) => {
  const pageSize = perPage || PAGINATION_DEFAULT;
  const skip = pageNumber ? pageNumber * pageSize : 0;

  try {
    const [data, count] = await db.$transaction([
      db.cog_police_officer.findMany({
        ...(orderBy ? { orderBy } : {}),
        ...(where ? { where } : {}),
        skip,
        take: perPage && Math.sign(perPage) === 1 ? pageSize : undefined,
      }),
      db.cog_police_officer.count({
        ...(where ? { where } : {}),
      }),
    ]);

    const playthrough = data as PoliceOfficer[];

    return { data: playthrough, count };
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};

export const getPoliceOfficer = async (id: string) => {
  try {
    const law = await db.cog_police_officer.findUnique({
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
