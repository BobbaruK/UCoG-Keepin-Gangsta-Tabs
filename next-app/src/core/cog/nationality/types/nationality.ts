import { Prisma } from "@/generated/prisma";
import { nationalityInclude } from "../constants/include";

export type Nationality = Prisma.cog_nationalityGetPayload<{
  include: typeof nationalityInclude;
}>;
