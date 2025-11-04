import { DEFAULT_LOGIN_REDIRECT } from "@/constants/routes";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default async function ProtectedAuthLayout({ children }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect(DEFAULT_LOGIN_REDIRECT);
  }

  return children;
}
