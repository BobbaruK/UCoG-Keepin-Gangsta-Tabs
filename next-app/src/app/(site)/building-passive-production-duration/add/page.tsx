import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { buildingPassiveDurationTitle } from "@/constants/page-title/building-passive-duration";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import FormCardWrapper from "@/features/building-passive-durations/components/form-card-wrapper";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: `Add ${buildingPassiveDurationTitle.label.singular.toLowerCase()}`,
};

const AddPassiveDurationPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  redirectNonAdminUsers({ to: buildingPassiveDurationTitle.href, session });

  return (
    <PageStructure>
      <PageBreadcrumbs
        crumbs={breadCrumbsFn([
          {
            href: buildingPassiveDurationTitle.href,
            label: capitalizeFirstLetter(
              buildingPassiveDurationTitle.label.plural,
            ),
          },
          {
            href: `${buildingPassiveDurationTitle.href}/add`,
            label: `Add ${buildingPassiveDurationTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />

      <PageTitle
        label={`Add ${buildingPassiveDurationTitle.label.singular.toLowerCase()}`}
        backBtnHref={buildingPassiveDurationTitle.href}
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

export default AddPassiveDurationPage;
