import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { vehicleTypesTitle } from "@/constants/page-title/vehicle-types";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import VehicleTypePresentation from "@/features/vehicle-types/components/vehicle-type-presentation";
import { getVehicleType } from "@/features/vehicle-types/data/get-vehicle-types";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "better-auth";
import type { Metadata } from "next";
import { headers } from "next/headers";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;

  const vehicleType = await getVehicleType(id);

  if (!vehicleType)
    return {
      title: "Unknown",
    };

  return {
    title: vehicleType.name,
  };
}

const VehicleTypePage = async ({ params }: Props) => {
  const id = (await params).id;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const vehicleType = await getVehicleType(id);

  if (!vehicleType)
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
              label: "Unknown",
            },
          ])}
        />

        <PageTitle
          label={"Unknown"}
          backBtnHref={vehicleTypesTitle.href}
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
        ])}
      />

      <PageTitle
        label={vehicleType.name}
        backBtnHref={vehicleTypesTitle.href}
        editBtnHref={`${vehicleTypesTitle.href}/${id}/edit`}
        session={session}
      />

      <VehicleTypePresentation vehicleType={vehicleType} />

      <div>TODO: tables here - auto_route</div>
    </PageStructure>
  );
};

export default VehicleTypePage;
