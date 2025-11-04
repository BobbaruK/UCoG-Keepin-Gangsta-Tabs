"use server";

import { UserRole } from "@/generated/prisma";

export const admin = async (role: UserRole) => {
  if (role === UserRole.ADMIN || role === UserRole.OWNER) {
    return { success: "Allow server action!" };
  }

  return { error: "Forbidden server action!" };
};
