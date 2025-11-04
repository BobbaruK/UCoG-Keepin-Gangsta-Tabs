import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Navbar } from "../navbar";
import { NavbarNavLink } from "../navigation";
import Link from "next/link";

export const Footer = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const defaultNavigationLinks: NavbarNavLink[] = [
    {
      href: "/server",
      label: "Server",
    },
    {
      href: "/client",
      label: "Client",
    },
    {
      href: "/admin",
      label: "Admin",
    },
    {
      href: "/icons",
      label: "Icons",
    },
  ];

  return (
    <footer className="mt-auto">
      <div className="container py-4">
        <ul className="flex items-center gap-4">
          {defaultNavigationLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};
