import { PAGINATION_DEFAULT } from "@/constants/table";
import { Prisma } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { headers } from "next/headers";

export const getUsersBAuth = async ({
  pageNumber,
  perPage,
  sortBy,
  sortDirection,
  searchField,
  searchValue,
}: {
  perPage?: number;
  pageNumber?: number;
  sortBy: string;
  sortDirection: "asc" | "desc" | undefined;
  searchField: "email" | "name" | undefined;
  searchValue: string;
}) => {
  const limit = perPage || PAGINATION_DEFAULT;
  const offset = pageNumber ? pageNumber * limit : 0;

  try {
    const data = await auth.api.listUsers({
      query: {
        // pagination
        limit,
        offset,
        // sorting
        sortBy,
        sortDirection,
        // filtering
        searchField,
        searchValue,
        searchOperator: "contains",
      },
      headers: await headers(),
    });

    return {
      data: data.users,
      total: data.total,
    };
  } catch {
    return null;
  }
};

export const getUsersPrisma = async ({
  where,
  perPage,
  pageNumber,
  orderBy,
}: {
  where?: Prisma.auth_userWhereInput;
  perPage?: number;
  pageNumber?: number;
  orderBy?: Prisma.auth_userOrderByWithRelationInput;
}) => {
  const pageSize = perPage || PAGINATION_DEFAULT;
  const skip = pageNumber ? pageNumber * pageSize : 0;

  try {
    const user = await db.auth_user.findMany({
      ...(orderBy ? { orderBy } : {}),
      ...(where ? { where } : {}),
      skip,
      take: perPage && Math.sign(perPage) === 1 ? pageSize : undefined,
    });

    return user;
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};
