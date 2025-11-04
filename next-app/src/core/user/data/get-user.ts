import { Prisma } from "@/generated/prisma";
import db from "@/lib/prisma";

// export const getUser = async (id: string) => {
export const getUser = async ({
  where,
}: {
  where: Prisma.auth_userWhereUniqueInput;
}) => {
  try {
    const user = await db.auth_user.findUnique({
      where,
      include: {
        accounts: {
          select: {
            providerId: true,
          },
        },
      },
    });

    return user;
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};
