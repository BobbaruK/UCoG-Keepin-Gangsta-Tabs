import { Prisma } from "@/generated/prisma";

export type Law = Prisma.cog_lawGetPayload<{
  include: {
    sideEffect: {
      select: {
        id: true;
        name: true;
        type: true;
        value: true;
      };
    };
  };
}>;
