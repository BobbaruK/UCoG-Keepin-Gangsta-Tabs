import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { MESSAGES } from "@/constants/messages";
import { vehicleTypesTitle } from "@/constants/page-title/vehicle-types";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import EditVehicleTypeForm from "@/features/vehicle-types/components/form/edit";
import { getVehicleType } from "@/features/vehicle-types/data/get-vehicle-types";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "better-auth";
import { Metadata } from "next";
import { headers } from "next/headers";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;

  const vehicleType = await getVehicleType(id);

  return {
    title: `Edit ${vehicleType?.name}`,
  };
}

const EditVehicleTypePage = async ({ params }: Props) => {
  const id = (await params).id;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  redirectNonAdminUsers({ to: `${vehicleTypesTitle.href}/${id}`, session });

  const vehicleType = await getVehicleType(id);

  if (!vehicleType)
    return (
      <PageStructure>
        <PageTitle
          label={"unknown"}
          backBtnHref={`${vehicleTypesTitle.href}`}
          session={session}
        />
        <CustomAlert
          title={"Error!"}
          description={MESSAGES.RESOURCE_NOT_EXISTS}
          variant="danger"
        />
      </PageStructure>
    );

  return (
    <PageStructure>
      <PageBreadcrumbs
        crumbs={breadCrumbsFn([
          {
            href: vehicleTypesTitle.href,
            label: capitalizeFirstLetter(
              vehicleTypesTitle.label.plural.toLowerCase(),
            ),
          },
          {
            href: `${vehicleTypesTitle.href}/${id}`,
            label: vehicleType.name,
          },
          {
            label: `Edit ${vehicleTypesTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />
      <PageTitle
        label={`Edit "${vehicleType.name}"`}
        backBtnHref={`${vehicleTypesTitle.href}/${id}`}
        session={session}
      />

      <Card>
        <CardContent>
          <EditVehicleTypeForm vehicleType={vehicleType} />
        </CardContent>
      </Card>

      {/* <div>
        <pre>{JSON.stringify({ trait }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default EditVehicleTypePage;
