import { Prisma } from "@/generated/prisma";
import { crewMemberInclude } from "../constants/include";

export type CrewMember = Prisma.cog_crew_memberGetPayload<{
  include: typeof crewMemberInclude;
}>;
