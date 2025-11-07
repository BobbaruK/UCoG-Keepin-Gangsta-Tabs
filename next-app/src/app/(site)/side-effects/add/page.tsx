import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { sideEffectsTitle } from "@/constants/page-title/side-effects";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import AddSideEffectForm from "@/features/side-effects/components/forms/add-side-effect";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Add Side Effect",
};

const SideEffectsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  redirectNonAdminUsers({ to: sideEffectsTitle.href, session });

  return (
    <PageStructure>
      <PageTitle
        label={`Add ${sideEffectsTitle.label.singular}`}
        backBtnHref={sideEffectsTitle.href}
        session={session}
      />

      <AddSideEffectForm />

      {/* <div>
        <pre>{JSON.stringify({ sideEffects }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default SideEffectsPage;
