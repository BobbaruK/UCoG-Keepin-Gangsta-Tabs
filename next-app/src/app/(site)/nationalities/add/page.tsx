import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { nationalitiesTitle } from "@/constants/page-title/nationalities";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import AddNationalityForm from "@/features/nationalities/components/form/add";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: `Add ${nationalitiesTitle.label.singular}`,
};

const AddNationalityPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  redirectNonAdminUsers({ to: nationalitiesTitle.href, session });

  return (
    <PageStructure>
      <PageBreadcrumbs
        crumbs={breadCrumbsFn([
          {
            href: nationalitiesTitle.href,
            label: capitalizeFirstLetter(nationalitiesTitle.label.plural),
          },
          {
            href: `${nationalitiesTitle.href}/add`,
            label: `Add ${nationalitiesTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />
      <PageTitle
        label={`Add ${nationalitiesTitle.label.singular.toLowerCase()}`}
        backBtnHref={nationalitiesTitle.href}
        session={session}
      />

      <Card>
        <CardContent>
          <AddNationalityForm />
        </CardContent>
      </Card>

      {/* <div>
        <pre>{JSON.stringify({ sideEffects }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default AddNationalityPage;
