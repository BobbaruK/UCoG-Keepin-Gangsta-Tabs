import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { sideEffectsTitle } from "@/constants/page-title/side-effects";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import AddSideEffectForm from "@/features/side-effects/components/forms/add";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: `Add ${sideEffectsTitle.label.singular.toLowerCase()}`,
};

const SideEffectsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  redirectNonAdminUsers({ to: sideEffectsTitle.href, session });

  return (
    <PageStructure>
      <PageBreadcrumbs
        crumbs={breadCrumbsFn([
          {
            href: sideEffectsTitle.href,
            label: capitalizeFirstLetter(sideEffectsTitle.label.plural),
          },
          {
            href: `${sideEffectsTitle.href}/add`,
            label: `Add ${sideEffectsTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />
      <PageTitle
        label={`Add ${sideEffectsTitle.label.singular.toLowerCase()}`}
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
