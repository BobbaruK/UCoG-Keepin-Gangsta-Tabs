import { Prisma } from "@/generated/prisma";
import { autoRouteInclude } from "../constants/include";

export type AutoRoute = Prisma.cog_auto_routeGetPayload<{
  include: typeof autoRouteInclude;
}>;
