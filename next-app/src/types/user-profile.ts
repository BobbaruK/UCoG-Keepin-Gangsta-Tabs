import { Prisma } from "@/generated/prisma";

export type UserProfile = Prisma.auth_userGetPayload<{
  include: {
    accounts: {
      select: {
        providerId: true;
      };
    };
  };
}>;
