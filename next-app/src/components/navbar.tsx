"use client";

import { Session } from "@/types/session";
import { usePathname } from "next/navigation";
import { NavbarNavLink, Navigation } from "./navigation";

interface Props {
  session: Session | null;
}

export const Navbar = ({ session }: Props) => {
  const pathname = usePathname();

  const defaultNavigationLinks: NavbarNavLink[] = [
    {
      href: "/server",
      label: "Server",
      active: pathname === "/server" ? true : false,
    },
    {
      href: "/client",
      label: "Client",
      active: pathname === "/client" ? true : false,
    },
    {
      href: "/admin",
      label: "Admin",
      active: pathname === "/admin" ? true : false,
    },
    {
      href: "/icons",
      label: "Icons",
      active: pathname === "/icons" ? true : false,
    },
  ];

  return (
    <Navigation navigationLinks={defaultNavigationLinks} session={session} />
  );
};
