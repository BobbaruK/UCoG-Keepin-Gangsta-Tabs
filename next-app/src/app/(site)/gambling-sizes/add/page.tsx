import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { gamblingSizeTitle } from "@/constants/page-title/gambling-size";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import FormCardWrapper from "@/features/gambling-sizes/components/form-card-wrapper";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: `Add ${gamblingSizeTitle.label.singular.toLowerCase()}`,
};

const AddGamblingSizePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  redirectNonAdminUsers({ to: gamblingSizeTitle.href, session });

  return (
    <PageStructure>
      <PageBreadcrumbs
        crumbs={breadCrumbsFn([
          {
            href: gamblingSizeTitle.href,
            label: capitalizeFirstLetter(gamblingSizeTitle.label.plural),
          },
          {
            href: `${gamblingSizeTitle.href}/add`,
            label: `Add ${gamblingSizeTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />
      <PageTitle
        label={`Add ${gamblingSizeTitle.label.singular.toLowerCase()}`}
        backBtnHref={gamblingSizeTitle.href}
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

export default AddGamblingSizePage;
