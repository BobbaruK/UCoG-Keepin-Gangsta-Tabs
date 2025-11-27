import { Prisma } from "@/generated/prisma";
import { crewLevelInclude } from "../constants/include";

export type CrewLevel = Prisma.cog_crew_levelGetPayload<{
  include: typeof crewLevelInclude;
}>;
