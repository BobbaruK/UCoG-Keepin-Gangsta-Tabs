import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { resourcesTitle } from "@/constants/page-title/resources";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { getResourceTypes } from "@/features/resource-types/data/get-resource-types";
import AddResourceForm from "@/features/resources/components/form/add";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: `Add ${resourcesTitle.label.singular}`,
};

const AddResourceTypePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  redirectNonAdminUsers({ to: resourcesTitle.href, session });

  const resourceTypes = await getResourceTypes({});

  return (
    <PageStructure>
      <PageBreadcrumbs
        crumbs={breadCrumbsFn([
          {
            href: resourcesTitle.href,
            label: capitalizeFirstLetter(resourcesTitle.label.plural),
          },
          {
            href: `${resourcesTitle.href}/add`,
            label: `Add ${resourcesTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />
      <PageTitle
        label={`Add ${resourcesTitle.label.singular.toLowerCase()}`}
        backBtnHref={resourcesTitle.href}
        session={session}
      />

      <AddResourceForm resourceTypes={resourceTypes?.data || []} />

      {/* <div>
        <pre>{JSON.stringify({ sideEffects }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default AddResourceTypePage;
