import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Navbar } from "../navbar";

export const Header = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <header>
      <div className="container py-4">
        <Navbar session={session} />
      </div>
    </header>
  );
};
