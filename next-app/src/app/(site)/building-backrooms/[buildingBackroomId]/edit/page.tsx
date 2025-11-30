import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { buildingBackroomsTitle } from "@/constants/page-title/building-backrooms";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import FormCardWrapper from "@/features/building-backrooms/components/form-card-wrapper";
import { getBuildingBackroom } from "@/features/building-backrooms/data/get-building-backrooms";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "better-auth";
import { Metadata } from "next";
import { headers } from "next/headers";

interface Props {
  params: Promise<{
    buildingBackroomId: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { buildingBackroomId } = await params;

  const buildingType = await getBuildingBackroom(buildingBackroomId);

  if (!buildingType)
    return {
      title: `Edit ${buildingBackroomsTitle.label.singular.toLowerCase()}: "Unknown"`,
    };

  return {
    title: `Edit ${buildingBackroomsTitle.label.singular.toLowerCase()}: "${buildingType.name}"`,
  };
}

const EditBuildingBackroomPage = async ({ params }: Props) => {
  const { buildingBackroomId } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  redirectNonAdminUsers({
    to: `${buildingBackroomsTitle.href}/${buildingBackroomId}`,
    session,
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
          label={"unknown"}
          backBtnHref={`${buildingBackroomsTitle.href}`}
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
          {
            label: `Edit ${buildingBackroomsTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />

      <PageTitle
        label={`Edit "${buildingBackroom.name}"`}
        backBtnHref={`${buildingBackroomsTitle.href}/${buildingBackroomId}`}
        session={session}
      />

      <FormCardWrapper
        data={{
          type: "edit",
          backroom: buildingBackroom,
        }}
      />

      {/* <div>
        <pre>{JSON.stringify({ trait }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default EditBuildingBackroomPage;
