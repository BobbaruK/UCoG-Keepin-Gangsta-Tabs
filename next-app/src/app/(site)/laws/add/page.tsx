import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { lawsTitle } from "@/constants/page-title/laws";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import AddLawForm from "@/features/laws/components/form/add";
import { getSideEffects } from "@/features/side-effects/data/get-side-effects";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: `Add ${lawsTitle.label.singular}`,
};

const AddLawPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  redirectNonAdminUsers({ to: lawsTitle.href, session });

  const sideEffects = await getSideEffects({});

  return (
    <PageStructure>
      <PageBreadcrumbs
        crumbs={breadCrumbsFn([
          {
            href: lawsTitle.href,
            label: capitalizeFirstLetter(lawsTitle.label.plural),
          },
          {
            href: `${lawsTitle.href}/add`,
            label: `Add ${lawsTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />
      <PageTitle
        label={`Add ${lawsTitle.label.singular.toLowerCase()}`}
        backBtnHref={lawsTitle.href}
        session={session}
      />

      <Card>
        <CardContent>
          <AddLawForm sideEffects={sideEffects?.data} />
        </CardContent>
      </Card>

      {/* <div>
        <pre>{JSON.stringify({ sideEffects }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default AddLawPage;
