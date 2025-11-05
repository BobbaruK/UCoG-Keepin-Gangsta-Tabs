import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import AddSideEffectForm from "@/core/admin/side-effects/components/forms/add-side-effect";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Add Side Effect",
};

const UsersPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <PageStructure>
      <PageTitle
        label={"Add side effects"}
        backBtnHref="/side-effect"
        role={session?.user.role as UserRole}
      />

      <AddSideEffectForm />

      {/* <div>
        <pre>{JSON.stringify({ sideEffects }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default UsersPage;
