import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { buildingBackroomsTitle } from "@/constants/page-title/building-backrooms";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import BuildingBackroomPresentation from "@/features/building-backrooms/components/building-backroom-presentation";
import { getBuildingBackroom } from "@/features/building-backrooms/data/get-building-backrooms";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "better-auth";
import type { Metadata } from "next";
import { headers } from "next/headers";

interface Props {
  params: Promise<{
    buildingBackroomId: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { buildingBackroomId } = await params;

  const buildingBackroom = await getBuildingBackroom(buildingBackroomId);

  if (!buildingBackroom)
    return {
      title: `${capitalizeFirstLetter(
        buildingBackroomsTitle.label.singular.toLowerCase(),
      )}: "Unknown"`,
    };

  return {
    title: `${capitalizeFirstLetter(
      buildingBackroomsTitle.label.singular.toLowerCase(),
    )}: "${buildingBackroom.name}"`,
  };
}

const BuildingBackroomPage = async ({ params }: Props) => {
  const { buildingBackroomId } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const buildingBackroom = await getBuildingBackroom(buildingBackroomId);

  if (!buildingBackroom)
    return (
      <PageStructure>
        <PageBreadcrumbs
          crumbs={breadCrumbsFn([
            {
              href: buildingBackroomsTitle.href,
              label: capitalizeFirstLetter(
                capitalizeFirstLetter(
                  buildingBackroomsTitle.label.plural.toLowerCase(),
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
          backBtnHref={buildingBackroomsTitle.href}
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
            href: buildingBackroomsTitle.href,
            label: capitalizeFirstLetter(
              buildingBackroomsTitle.label.plural.toLowerCase(),
            ),
          },
          {
            href: `${buildingBackroomsTitle.href}/${buildingBackroomId}`,
            label: buildingBackroom.name,
          },
        ])}
      />

      <PageTitle
        label={buildingBackroom.name}
        backBtnHref={buildingBackroomsTitle.href}
        editBtnHref={`${buildingBackroomsTitle.href}/${buildingBackroomId}/edit`}
        session={session}
      />

      <BuildingBackroomPresentation buildingBackroom={buildingBackroom} />
    </PageStructure>
  );
};

export default BuildingBackroomPage;
