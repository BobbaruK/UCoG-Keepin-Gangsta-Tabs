import { Prisma } from "@/generated/prisma";
import { policeOfficerInclude } from "../constants/include";

export type PoliceOfficer = Prisma.cog_police_officerGetPayload<{
  include: typeof policeOfficerInclude;
}>;
