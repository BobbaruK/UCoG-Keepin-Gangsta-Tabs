import { PageStructure } from "@/components/page-structure";
import { UserInfo } from "@/core/user/components/user-info";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Server",
};

const ServerPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <PageStructure>
      <h1 className="text-3xl font-bold">Server</h1>

      <UserInfo user={session && session.user} />
    </PageStructure>
  );
};

export default ServerPage;
