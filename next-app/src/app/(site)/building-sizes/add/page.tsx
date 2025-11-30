import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { buildingSizesTitle } from "@/constants/page-title/building-sizes";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import FormCardWrapper from "@/features/building-sizes/components/form-card-wrapper";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: `Add ${buildingSizesTitle.label.singular.toLowerCase()}`,
};

const AddBuildingSizePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  redirectNonAdminUsers({ to: buildingSizesTitle.href, session });

  return (
    <PageStructure>
      <PageBreadcrumbs
        crumbs={breadCrumbsFn([
          {
            href: buildingSizesTitle.href,
            label: capitalizeFirstLetter(buildingSizesTitle.label.plural),
          },
          {
            href: `${buildingSizesTitle.href}/add`,
            label: `Add ${buildingSizesTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />

      <PageTitle
        label={`Add ${buildingSizesTitle.label.singular.toLowerCase()}`}
        backBtnHref={buildingSizesTitle.href}
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

export default AddBuildingSizePage;
