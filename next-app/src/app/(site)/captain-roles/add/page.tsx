import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { captainRolesTitle } from "@/constants/page-title/captain-roles";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import AddCaptainRoleForm from "@/features/captain-roles/components/form/add";
import { getSideEffects } from "@/features/side-effects/data/get-side-effects";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: `Add ${captainRolesTitle.label.singular}`,
};

const AddCaptainRolePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  redirectNonAdminUsers({ to: captainRolesTitle.href, session });

  const sideEffects = await getSideEffects();

  return (
    <PageStructure>
      <PageBreadcrumbs
        crumbs={breadCrumbsFn([
          {
            href: captainRolesTitle.href,
            label: capitalizeFirstLetter(captainRolesTitle.label.plural),
          },
          {
            href: `${captainRolesTitle.href}/add`,
            label: `Add ${captainRolesTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />
      <PageTitle
        label={`Add ${captainRolesTitle.label.singular.toLowerCase()}`}
        backBtnHref={captainRolesTitle.href}
        session={session}
      />

      <AddCaptainRoleForm sideEffects={sideEffects?.data || []} />

      <div>
        <pre>{JSON.stringify({ sideEffects }, null, 2)}</pre>
      </div>
    </PageStructure>
  );
};

export default AddCaptainRolePage;
