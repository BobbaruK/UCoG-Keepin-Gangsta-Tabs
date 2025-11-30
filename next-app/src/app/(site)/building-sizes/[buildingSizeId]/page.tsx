import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { buildingSizesTitle } from "@/constants/page-title/building-sizes";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import BuildingSizePresentation from "@/features/building-sizes/components/building-size-presentation";
import { getBuildingSize } from "@/features/building-sizes/data/get-building-sizes";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "better-auth";
import type { Metadata } from "next";
import { headers } from "next/headers";

interface Props {
  params: Promise<{
    buildingSizeId: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { buildingSizeId } = await params;

  const buildingSize = await getBuildingSize(buildingSizeId);

  if (!buildingSize)
    return {
      title: `${capitalizeFirstLetter(
        buildingSizesTitle.label.singular.toLowerCase(),
      )}: "Unknown"`,
    };

  return {
    title: `${capitalizeFirstLetter(
      buildingSizesTitle.label.singular.toLowerCase(),
    )}: "${buildingSize.name}"`,
  };
}

const BuildingBackroomPage = async ({ params }: Props) => {
  const { buildingSizeId } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const buildingSize = await getBuildingSize(buildingSizeId);

  if (!buildingSize)
    return (
      <PageStructure>
        <PageBreadcrumbs
          crumbs={breadCrumbsFn([
            {
              href: buildingSizesTitle.href,
              label: capitalizeFirstLetter(
                capitalizeFirstLetter(
                  buildingSizesTitle.label.plural.toLowerCase(),
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
          backBtnHref={buildingSizesTitle.href}
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
            href: buildingSizesTitle.href,
            label: capitalizeFirstLetter(
              buildingSizesTitle.label.plural.toLowerCase(),
            ),
          },
          {
            href: `${buildingSizesTitle.href}/${buildingSizeId}`,
            label: buildingSize.name,
          },
        ])}
      />

      <PageTitle
        label={buildingSize.name}
        backBtnHref={buildingSizesTitle.href}
        editBtnHref={`${buildingSizesTitle.href}/${buildingSizeId}/edit`}
        session={session}
      />

      <BuildingSizePresentation buildingSize={buildingSize} />
    </PageStructure>
  );
};

export default BuildingBackroomPage;
