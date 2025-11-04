"use client";

import { Session } from "@/types/session";
import { NavbarNavLink, Navigation } from "./navigation";

interface Props {
  session: Session | null;
}

export const Navbar = ({ session }: Props) => {
  const defaultNavigationLinks: NavbarNavLink[] = [];

  return (
    <Navigation navigationLinks={defaultNavigationLinks} session={session} />
  );
};
