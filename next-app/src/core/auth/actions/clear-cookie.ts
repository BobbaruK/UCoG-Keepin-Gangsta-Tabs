"use server";

import { cookies } from "next/headers";

export const clearCookie = async (cookie: string) => {
  const cookieStore = await cookies();

  cookieStore.set(cookie, "", {
    path: "/",
    maxAge: -1,
  });
};
