import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { buildingTypesTitle } from "@/constants/page-title/building-types";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import FormCardWrapper from "@/features/building-types/components/form-card-wrapper";
import { getBuildingType } from "@/features/building-types/data/get-building-types";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "better-auth";
import { Metadata } from "next";
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
      title: `Edit ${buildingTypesTitle.label.singular.toLowerCase()}: "Unknown"`,
    };

  return {
    title: `Edit ${buildingTypesTitle.label.singular.toLowerCase()}: "${buildingType.name}"`,
  };
}

const EditResourceTypePage = async ({ params }: Props) => {
  const { buildingTypeId } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  redirectNonAdminUsers({
    to: `${buildingTypesTitle.href}/${buildingTypeId}`,
    session,
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
          label={"unknown"}
          backBtnHref={`${buildingTypesTitle.href}`}
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
          {
            label: `Edit ${buildingTypesTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />

      <PageTitle
        label={`Edit "${buildingType.name}"`}
        backBtnHref={`${buildingTypesTitle.href}/${buildingTypeId}`}
        session={session}
      />

      <FormCardWrapper
        data={{
          type: "edit",
          building: buildingType,
        }}
      />

      {/* <div>
        <pre>{JSON.stringify({ trait }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default EditResourceTypePage;
