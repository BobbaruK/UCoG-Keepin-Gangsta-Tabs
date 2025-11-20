import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { vehicleTypesTitle } from "@/constants/page-title/vehicle-types";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import AddVehicleTypeForm from "@/features/vehicle-types/components/form/add";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: `Add ${vehicleTypesTitle.label.singular}`,
};

const AddVehicleTypePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  redirectNonAdminUsers({ to: vehicleTypesTitle.href, session });

  return (
    <PageStructure>
      <PageBreadcrumbs
        crumbs={breadCrumbsFn([
          {
            href: vehicleTypesTitle.href,
            label: capitalizeFirstLetter(vehicleTypesTitle.label.plural),
          },
          {
            href: `${vehicleTypesTitle.href}/add`,
            label: `Add ${vehicleTypesTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />
      <PageTitle
        label={`Add ${vehicleTypesTitle.label.singular.toLowerCase()}`}
        backBtnHref={vehicleTypesTitle.href}
        session={session}
      />

      <Card>
        <CardContent>
          <AddVehicleTypeForm />
        </CardContent>
      </Card>

      {/* <div>
        <pre>{JSON.stringify({ sideEffects }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default AddVehicleTypePage;
