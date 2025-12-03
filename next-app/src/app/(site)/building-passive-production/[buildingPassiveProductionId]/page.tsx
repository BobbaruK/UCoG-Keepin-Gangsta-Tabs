import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { buildingPassiveTitle } from "@/constants/page-title/building-passive";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import BuildingPassivePresentation from "@/features/building-passive/components/building-passive-presentation";
import { getBuildingPassive } from "@/features/building-passive/data/get-building-passives";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "better-auth";
import type { Metadata } from "next";
import { headers } from "next/headers";

interface Props {
  params: Promise<{
    buildingPassiveProductionId: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { buildingPassiveProductionId } = await params;

  const buildingPassive = await getBuildingPassive(buildingPassiveProductionId);

  if (!buildingPassive)
    return {
      title: `${capitalizeFirstLetter(
        buildingPassiveTitle.label.singular.toLowerCase(),
      )}: "Unknown"`,
    };

  return {
    title: `${capitalizeFirstLetter(
      buildingPassiveTitle.label.singular.toLowerCase(),
    )}: "${buildingPassive.resource?.name} (${buildingPassive.quantity})"`,
  };
}

const BuildingPassiveDurationPage = async ({ params }: Props) => {
  const { buildingPassiveProductionId } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const buildingPassive = await getBuildingPassive(buildingPassiveProductionId);

  if (!buildingPassive)
    return (
      <PageStructure>
        <PageBreadcrumbs
          crumbs={breadCrumbsFn([
            {
              href: buildingPassiveTitle.href,
              label: capitalizeFirstLetter(
                capitalizeFirstLetter(
                  buildingPassiveTitle.label.plural.toLowerCase(),
                ),
              ),
            },
            {
              label: "Unknown",
            },
          ])}
        />

        <PageTitle
          label={"Unknown"}
          backBtnHref={buildingPassiveTitle.href}
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
            href: buildingPassiveTitle.href,
            label: capitalizeFirstLetter(
              buildingPassiveTitle.label.plural.toLowerCase(),
            ),
          },
          {
            href: `${buildingPassiveTitle.href}/${buildingPassiveProductionId}`,
            label: `${buildingPassive.resource?.name} (${buildingPassive.quantity})`,
          },
        ])}
      />

      <PageTitle
        label={`${buildingPassive.resource?.name} (${buildingPassive.quantity})`}
        backBtnHref={buildingPassiveTitle.href}
        editBtnHref={`${buildingPassiveTitle.href}/${buildingPassiveProductionId}/edit`}
        session={session}
      />

      <BuildingPassivePresentation buildingPassive={buildingPassive} />
    </PageStructure>
  );
};

export default BuildingPassiveDurationPage;
