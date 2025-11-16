import { PAGINATION_DEFAULT } from "@/constants/table";
import { Prisma } from "@/generated/prisma";
import db from "@/lib/prisma";
import { CrewMember, crewMemberInclude } from "../types/crew-member";

export const getCrewMembers = async ({
  where,
  perPage,
  pageNumber,
  orderBy,
}: {
  where?: Prisma.cog_crew_memberWhereInput;
  perPage?: number;
  pageNumber?: number;
  orderBy?: Prisma.cog_crew_memberOrderByWithRelationInput;
} = {}) => {
  const pageSize = perPage || PAGINATION_DEFAULT;
  const skip = pageNumber ? pageNumber * pageSize : 0;

  try {
    const [data, count] = await db.$transaction([
      db.cog_crew_member.findMany({
        ...(orderBy ? { orderBy } : {}),
        ...(where ? { where } : {}),
        skip,
        take: perPage && Math.sign(perPage) === 1 ? pageSize : undefined,
        include: crewMemberInclude,
      }),
      db.cog_crew_member.count({
        ...(where ? { where } : {}),
      }),
    ]);

    const crewMember = data as CrewMember[];

    return { data: crewMember, count };
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};

export const getCrewMember = async (id: string) => {
  try {
    const crewMember = await db.cog_crew_member.findUnique({
      where: {
        id,
      },
      include: crewMemberInclude,
    });

    return crewMember;
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};
