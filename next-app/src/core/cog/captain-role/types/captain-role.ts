import { Prisma } from "@/generated/prisma";
import { captainRoleInclude } from "../constants/include";

export type CaptainRole = Prisma.cog_captain_roleGetPayload<{
  include: typeof captainRoleInclude;
}>;
