import { Prisma } from "@/generated/prisma";
import { captainRoleInclude } from "@/lib/utils/db/captain-role-include";

export type CaptainRole = Prisma.cog_captain_roleGetPayload<{
  include: typeof captainRoleInclude;
}>;
