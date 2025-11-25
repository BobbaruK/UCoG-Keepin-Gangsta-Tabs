import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { resourceTypesTitle } from "@/constants/page-title/resource-types";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import FormCardWrapper from "@/features/resource-types/components/form-card-wrapper";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: `Add ${resourceTypesTitle.label.singular.toLowerCase()}`,
};

const AddResourceTypePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  redirectNonAdminUsers({ to: resourceTypesTitle.href, session });

  return (
    <PageStructure>
      <PageBreadcrumbs
        crumbs={breadCrumbsFn([
          {
            href: resourceTypesTitle.href,
            label: capitalizeFirstLetter(resourceTypesTitle.label.plural),
          },
          {
            href: `${resourceTypesTitle.href}/add`,
            label: `Add ${resourceTypesTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />

      <PageTitle
        label={`Add ${resourceTypesTitle.label.singular.toLowerCase()}`}
        backBtnHref={resourceTypesTitle.href}
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

export default AddResourceTypePage;
