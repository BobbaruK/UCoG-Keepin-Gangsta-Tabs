import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { buildingBackroomsTitle } from "@/constants/page-title/building-backrooms";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import FormCardWrapper from "@/features/building-backrooms/components/form-card-wrapper";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: `Add ${buildingBackroomsTitle.label.singular.toLowerCase()}`,
};

const AddBuildingTypePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  redirectNonAdminUsers({ to: buildingBackroomsTitle.href, session });

  return (
    <PageStructure>
      <PageBreadcrumbs
        crumbs={breadCrumbsFn([
          {
            href: buildingBackroomsTitle.href,
            label: capitalizeFirstLetter(buildingBackroomsTitle.label.plural),
          },
          {
            href: `${buildingBackroomsTitle.href}/add`,
            label: `Add ${buildingBackroomsTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />

      <PageTitle
        label={`Add ${buildingBackroomsTitle.label.singular.toLowerCase()}`}
        backBtnHref={buildingBackroomsTitle.href}
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
