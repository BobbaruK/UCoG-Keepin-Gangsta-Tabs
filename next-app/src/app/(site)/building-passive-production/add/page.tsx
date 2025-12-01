import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { buildingPassiveTitle } from "@/constants/page-title/building-passive";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import FormCardWrapper from "@/features/building-passive/components/form-card-wrapper";
import { getResource, getResources } from "@/features/resources/data/get";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: `Add ${buildingPassiveTitle.label.singular.toLowerCase()}`,
};

const AddBuildingPassivePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  redirectNonAdminUsers({ to: buildingPassiveTitle.href, session });

  const resources = await getResources();

  return (
    <PageStructure>
      <PageBreadcrumbs
        crumbs={breadCrumbsFn([
          {
            href: buildingPassiveTitle.href,
            label: capitalizeFirstLetter(buildingPassiveTitle.label.plural),
          },
          {
            href: `${buildingPassiveTitle.href}/add`,
            label: `Add ${buildingPassiveTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />

      <PageTitle
        label={`Add ${buildingPassiveTitle.label.singular.toLowerCase()}`}
        backBtnHref={buildingPassiveTitle.href}
        session={session}
      />

      <FormCardWrapper
        data={{
          type: "add",
          resources: resources?.data,
        }}
      />

      {/* <div>
        <pre>{JSON.stringify({ sideEffects }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default AddBuildingPassivePage;
