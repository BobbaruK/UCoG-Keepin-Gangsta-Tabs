import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { buildingTypesTitle } from "@/constants/page-title/building-types";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import FormCardWrapper from "@/features/building-types/components/form-card-wrapper";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: `Add ${buildingTypesTitle.label.singular.toLowerCase()}`,
};

const AddBuildingTypePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  redirectNonAdminUsers({ to: buildingTypesTitle.href, session });

  return (
    <PageStructure>
      <PageBreadcrumbs
        crumbs={breadCrumbsFn([
          {
            href: buildingTypesTitle.href,
            label: capitalizeFirstLetter(buildingTypesTitle.label.plural),
          },
          {
            href: `${buildingTypesTitle.href}/add`,
            label: `Add ${buildingTypesTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />

      <PageTitle
        label={`Add ${buildingTypesTitle.label.singular.toLowerCase()}`}
        backBtnHref={buildingTypesTitle.href}
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

export default AddBuildingTypePage;
