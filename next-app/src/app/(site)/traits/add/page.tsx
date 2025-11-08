import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { traitsTitle } from "@/constants/page-title/traits";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { getSideEffects } from "@/features/side-effects/data/get-side-effects";
import AddTraitForm from "@/features/traits/components/forms/add";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: `Add ${traitsTitle.label.singular}`,
};

const TraitsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  redirectNonAdminUsers({ to: traitsTitle.href, session });

  const sideEffects = await getSideEffects({});

  return (
    <PageStructure>
      <PageBreadcrumbs
        crumbs={breadCrumbsFn([
          {
            href: traitsTitle.href,
            label: capitalizeFirstLetter(traitsTitle.label.plural),
          },
          {
            href: `${traitsTitle.href}/add`,
            label: `Add ${traitsTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />
      <PageTitle
        label={`Add ${traitsTitle.label.singular.toLowerCase()}`}
        backBtnHref={traitsTitle.href}
        session={session}
      />

      <AddTraitForm sideEffects={sideEffects?.data} />

      {/* <div>
        <pre>{JSON.stringify({ sideEffects }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default TraitsPage;
