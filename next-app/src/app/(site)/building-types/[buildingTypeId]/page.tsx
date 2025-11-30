import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { buildingTypesTitle } from "@/constants/page-title/building-types";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import BuildingTypePresentation from "@/features/building-types/components/building-type-presentation";
import { getBuildingType } from "@/features/building-types/data/get-building-types";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "better-auth";
import type { Metadata } from "next";
import { headers } from "next/headers";

interface Props {
  params: Promise<{
    buildingTypeId: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { buildingTypeId } = await params;

  const buildingType = await getBuildingType(buildingTypeId);

  if (!buildingType)
    return {
      title: `${capitalizeFirstLetter(
        buildingTypesTitle.label.singular.toLowerCase(),
      )}: "Unknown"`,
    };

  return {
    title: `${capitalizeFirstLetter(
      buildingTypesTitle.label.singular.toLowerCase(),
    )}: "${buildingType.name}"`,
  };
}

const BuildingTypePage = async ({ params }: Props) => {
  const { buildingTypeId } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const buildingType = await getBuildingType(buildingTypeId);

  if (!buildingType)
    return (
      <PageStructure>
        <PageBreadcrumbs
          crumbs={breadCrumbsFn([
            {
              href: buildingTypesTitle.href,
              label: capitalizeFirstLetter(
                capitalizeFirstLetter(
                  buildingTypesTitle.label.plural.toLowerCase(),
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
          backBtnHref={buildingTypesTitle.href}
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
            href: buildingTypesTitle.href,
            label: capitalizeFirstLetter(
              buildingTypesTitle.label.plural.toLowerCase(),
            ),
          },
          {
            href: `${buildingTypesTitle.href}/${buildingTypeId}`,
            label: buildingType.name,
          },
        ])}
      />

      <PageTitle
        label={buildingType.name}
        backBtnHref={buildingTypesTitle.href}
        editBtnHref={`${buildingTypesTitle.href}/${buildingTypeId}/edit`}
        session={session}
      />

      <BuildingTypePresentation buildingType={buildingType} />
    </PageStructure>
  );
};

export default BuildingTypePage;
