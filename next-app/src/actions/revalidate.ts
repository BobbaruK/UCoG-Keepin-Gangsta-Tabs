"use server";

import { revalidatePath } from "next/cache";

export const revPath = async (path: string) => {
  revalidatePath(path);
};
