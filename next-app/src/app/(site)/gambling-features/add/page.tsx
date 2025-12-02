import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { gamblingFeatureTitle } from "@/constants/page-title/gambling-feature";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import FormCardWrapper from "@/features/gambling-features/components/form-card-wrapper";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: `Add ${gamblingFeatureTitle.label.singular.toLowerCase()}`,
};

const AddGamblingFeaturePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  redirectNonAdminUsers({ to: gamblingFeatureTitle.href, session });

  return (
    <PageStructure>
      <PageBreadcrumbs
        crumbs={breadCrumbsFn([
          {
            href: gamblingFeatureTitle.href,
            label: capitalizeFirstLetter(gamblingFeatureTitle.label.plural),
          },
          {
            href: `${gamblingFeatureTitle.href}/add`,
            label: `Add ${gamblingFeatureTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />

      <PageTitle
        label={`Add ${gamblingFeatureTitle.label.singular.toLowerCase()}`}
        backBtnHref={gamblingFeatureTitle.href}
        session={session}
      />

      <FormCardWrapper
        data={{
          type: "add",
        }}
      />

      {/* <div>
        <pre>{JSON.stringify({ sideEffects }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default AddGamblingFeaturePage;
