import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { buildingPassiveDurationTitle } from "@/constants/page-title/building-passive-duration";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import BuildingPassiveDurationPresentation from "@/features/building-passive-durations/components/building-passive-duration-presentation";
import { getBuildingPassiveDuration } from "@/features/building-passive-durations/data/get-building-passive-durations";
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

  const buildingPassiveDuration = await getBuildingPassiveDuration(
    buildingPassiveProductionId,
  );

  if (!buildingPassiveDuration)
    return {
      title: `${capitalizeFirstLetter(
        buildingPassiveDurationTitle.label.singular.toLowerCase(),
      )}: "Unknown"`,
    };

  return {
    title: `${capitalizeFirstLetter(
      buildingPassiveDurationTitle.label.singular.toLowerCase(),
    )}: "${buildingPassiveDuration.name}"`,
  };
}

const BuildingPassiveDurationPage = async ({ params }: Props) => {
  const { buildingPassiveProductionId } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const buildingPassiveDuration = await getBuildingPassiveDuration(
    buildingPassiveProductionId,
  );

  if (!buildingPassiveDuration)
    return (
      <PageStructure>
        <PageBreadcrumbs
          crumbs={breadCrumbsFn([
            {
              href: buildingPassiveDurationTitle.href,
              label: capitalizeFirstLetter(
                capitalizeFirstLetter(
                  buildingPassiveDurationTitle.label.plural.toLowerCase(),
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
          backBtnHref={buildingPassiveDurationTitle.href}
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
            href: buildingPassiveDurationTitle.href,
            label: capitalizeFirstLetter(
              buildingPassiveDurationTitle.label.plural.toLowerCase(),
            ),
          },
          {
            href: `${buildingPassiveDurationTitle.href}/${buildingPassiveProductionId}`,
            label: buildingPassiveDuration.name,
          },
        ])}
      />

      <PageTitle
        label={buildingPassiveDuration.name}
        backBtnHref={buildingPassiveDurationTitle.href}
        editBtnHref={`${buildingPassiveDurationTitle.href}/${buildingPassiveProductionId}/edit`}
        session={session}
      />

      <BuildingPassiveDurationPresentation
        buildingPassiveDuration={buildingPassiveDuration}
      />
    </PageStructure>
  );
};

export default BuildingPassiveDurationPage;
