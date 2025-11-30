import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { buildingPassiveDurationTitle } from "@/constants/page-title/building-passive-duration";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import FormCardWrapper from "@/features/building-passive-durations/components/form-card-wrapper";
import { getBuildingPassiveDuration } from "@/features/building-passive-durations/data/get-building-passive-durations";
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

  const buildingPassiveDuration = await getBuildingPassiveDuration(
    buildingPassiveProductionId,
  );

  if (!buildingPassiveDuration)
    return {
      title: `Edit ${buildingPassiveDurationTitle.label.singular.toLowerCase()}: "Unknown"`,
    };

  return {
    title: `Edit ${buildingPassiveDurationTitle.label.singular.toLowerCase()}: "${buildingPassiveDuration.name}"`,
  };
}

const EditBuildingPassiveDurationPage = async ({ params }: Props) => {
  const { buildingPassiveProductionId } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  redirectNonAdminUsers({
    to: `${buildingPassiveDurationTitle.href}/${buildingPassiveProductionId}`,
    session,
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
          label={"unknown"}
          backBtnHref={`${buildingPassiveDurationTitle.href}`}
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
          {
            label: `Edit ${buildingPassiveDurationTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />

      <PageTitle
        label={`Edit "${buildingPassiveDuration.name}"`}
        backBtnHref={`${buildingPassiveDurationTitle.href}/${buildingPassiveProductionId}`}
        session={session}
      />

      <FormCardWrapper
        data={{
          type: "edit",
          passiveDuration: buildingPassiveDuration,
        }}
      />

      {/* <div>
        <pre>{JSON.stringify({ trait }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default EditBuildingPassiveDurationPage;
