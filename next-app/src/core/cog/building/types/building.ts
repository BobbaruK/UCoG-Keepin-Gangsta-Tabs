import { Prisma } from "@/generated/prisma";
import { buildingInclude } from "../constants/include";

export type Building = Prisma.cog_buildingGetPayload<{
  include: typeof buildingInclude;
}>;
