import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { crewLevelsTitle } from "@/constants/page-title/crew-levels";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import FormCardWrapper from "@/features/crew-levels/components/form-card-wrapper";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: `Add ${crewLevelsTitle.label.singular.toLowerCase()}`,
};

const AddCrewLevelPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  redirectNonAdminUsers({ to: crewLevelsTitle.href, session });

  return (
    <PageStructure>
      <PageBreadcrumbs
        crumbs={breadCrumbsFn([
          {
            href: crewLevelsTitle.href,
            label: capitalizeFirstLetter(crewLevelsTitle.label.plural),
          },
          {
            href: `${crewLevelsTitle.href}/add`,
            label: `Add ${crewLevelsTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />
      <PageTitle
        label={`Add ${crewLevelsTitle.label.singular.toLowerCase()}`}
        backBtnHref={crewLevelsTitle.href}
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

export default AddCrewLevelPage;
