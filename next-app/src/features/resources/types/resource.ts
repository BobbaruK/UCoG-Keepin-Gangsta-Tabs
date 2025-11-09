import { Prisma } from "@/generated/prisma";

export type Resource = Prisma.cog_resourceGetPayload<{
  include: {
    resource_type: {
      select: {
        id: true;
        name: true;
        capacity: true;
      };
    };
  };
}>;
