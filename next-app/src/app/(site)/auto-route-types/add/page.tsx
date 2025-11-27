import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { autoRouteTypesTitle } from "@/constants/page-title/auto-route-types";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import FormCardWrapper from "@/features/auto-route-types/components/form-card-wrapper";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: `Add ${autoRouteTypesTitle.label.singular.toLowerCase()}`,
};

const AddCaptainRolePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  redirectNonAdminUsers({ to: autoRouteTypesTitle.href, session });

  return (
    <PageStructure>
      <PageBreadcrumbs
        crumbs={breadCrumbsFn([
          {
            href: autoRouteTypesTitle.href,
            label: capitalizeFirstLetter(autoRouteTypesTitle.label.plural),
          },
          {
            href: `${autoRouteTypesTitle.href}/add`,
            label: `Add ${autoRouteTypesTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />

      <PageTitle
        label={`Add ${autoRouteTypesTitle.label.singular.toLowerCase()}`}
        backBtnHref={autoRouteTypesTitle.href}
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

export default AddCaptainRolePage;
