import { Prisma } from "@/generated/prisma";

export const policeOfficerInclude = {
  cogPlaythrough: {
    select: {
      id: true,
      is_finished: true,
    },
  },
} satisfies Prisma.cog_police_officerInclude;
