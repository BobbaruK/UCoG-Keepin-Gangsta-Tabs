import { Prisma } from "@/generated/prisma";
import { buildingPassiveInclude } from "../constants/include";

export type BuildingPassive = Prisma.cog_building_passive_productionGetPayload<{
  include: typeof buildingPassiveInclude;
}>;
