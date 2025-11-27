import { Prisma } from "@/generated/prisma";
import { resourceTypeInclude } from "../constants/include";

export type ResourceType = Prisma.cog_resource_typeGetPayload<{
  include: typeof resourceTypeInclude;
}>;
