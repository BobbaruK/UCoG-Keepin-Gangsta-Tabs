import { Prisma } from "@/generated/prisma";
import { gamblingBuildingInclude } from "../constants/include";

export type GamblingBuilding = Prisma.cog_gambling_buildingGetPayload<{
  include: typeof gamblingBuildingInclude;
}>;
