import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { buildingBackroomsTitle } from "@/constants/page-title/building-backrooms";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import FormCardWrapper from "@/features/building-sizes/components/form-card-wrapper";
import { getBuildingSize } from "@/features/building-sizes/data/get-building-sizes";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "better-auth";
import { Metadata } from "next";
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
      title: `Edit ${buildingBackroomsTitle.label.singular.toLowerCase()}: "Unknown"`,
    };

  return {
    title: `Edit ${buildingBackroomsTitle.label.singular.toLowerCase()}: "${buildingSize.name}"`,
  };
}

const EditBuildingBackroomPage = async ({ params }: Props) => {
  const { buildingSizeId } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  redirectNonAdminUsers({
    to: `${buildingBackroomsTitle.href}/${buildingSizeId}`,
    session,
  });

  const buildingSize = await getBuildingSize(buildingSizeId);

  if (!buildingSize)
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
            href: `${buildingBackroomsTitle.href}/${buildingSizeId}`,
            label: buildingSize.name,
          },
          {
            label: `Edit ${buildingBackroomsTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />

      <PageTitle
        label={`Edit "${buildingSize.name}"`}
        backBtnHref={`${buildingBackroomsTitle.href}/${buildingSizeId}`}
        session={session}
      />

      <FormCardWrapper
        data={{
          type: "edit",
          sizes: buildingSize,
        }}
      />

      {/* <div>
        <pre>{JSON.stringify({ trait }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default EditBuildingBackroomPage;
