import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { buildingPassiveTitle } from "@/constants/page-title/building-passive";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import FormCardWrapper from "@/features/building-passive/components/form-card-wrapper";
import { getBuildingPassive } from "@/features/building-passive/data/get-building-passives";
import { getResources } from "@/features/resources/data/get";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "better-auth";
import { Metadata } from "next";
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
      title: `Edit ${buildingPassiveTitle.label.singular.toLowerCase()}: "Unknown"`,
    };

  return {
    title: `Edit ${buildingPassiveTitle.label.singular.toLowerCase()}: "${buildingPassive.resource?.name} (${buildingPassive.quantity})"`,
  };
}

const EditBuildingPassiveDurationPage = async ({ params }: Props) => {
  const { buildingPassiveProductionId } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  redirectNonAdminUsers({
    to: `${buildingPassiveTitle.href}/${buildingPassiveProductionId}`,
    session,
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
          label={"unknown"}
          backBtnHref={`${buildingPassiveTitle.href}`}
          session={session}
        />

        <CustomAlert
          title={"Error!"}
          description={MESSAGES.RESOURCE_NOT_EXISTS}
          variant="danger"
        />
      </PageStructure>
    );

  const resources = await getResources();

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
          {
            label: `Edit ${buildingPassiveTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />

      <PageTitle
        label={`Edit "${buildingPassive.resource?.name} (${buildingPassive.quantity})"`}
        backBtnHref={`${buildingPassiveTitle.href}/${buildingPassiveProductionId}`}
        session={session}
      />

      <FormCardWrapper
        data={{
          type: "edit",
          passive: buildingPassive,
          resources: resources?.data,
        }}
      />

      {/* <div>
        <pre>{JSON.stringify({ trait }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default EditBuildingPassiveDurationPage;
