import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { resourceTypesTitle } from "@/constants/page-title/resource-types";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import AddResourceTypeForm from "@/features/resource-types/components/form/add";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: `Add ${resourceTypesTitle.label.singular}`,
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

      <Card>
        <CardContent>
          <AddResourceTypeForm />
        </CardContent>
      </Card>

      {/* <div>
        <pre>{JSON.stringify({ sideEffects }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default AddResourceTypePage;
