import { Prisma } from "@/generated/prisma";

export type SideEffect = Prisma.cog_side_effectGetPayload<{
  include: {};
}>;
