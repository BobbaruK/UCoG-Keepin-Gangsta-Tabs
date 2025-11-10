import { Prisma } from "@/generated/prisma";

export const resourceInclude: Prisma.cog_resourceInclude = {
  resource_type: {
    select: {
      id: true,
      name: true,
      capacity: true,
    },
  },
};

export type Resource = Prisma.cog_resourceGetPayload<{
  include: typeof resourceInclude;
}>;
