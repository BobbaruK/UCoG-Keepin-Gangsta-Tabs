import { cog_captain_role, Prisma } from "@/generated/prisma";

export const captainRoleInclude: Prisma.cog_captain_roleInclude = {
  sideEffect: {
    select: {
      id: true,
      name: true,
      value: true,
    },
  },
};

export type CaptainRole = Prisma.cog_captain_roleGetPayload<{
  include: typeof captainRoleInclude;
}>;
