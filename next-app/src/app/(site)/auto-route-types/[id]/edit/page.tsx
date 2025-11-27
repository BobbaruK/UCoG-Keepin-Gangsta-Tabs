import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { autoRouteTypesTitle } from "@/constants/page-title/auto-route-types";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import FormCardWrapper from "@/features/auto-route-types/components/form-card-wrapper";
import { getAutoRouteType } from "@/features/auto-route-types/data/get-auto-route-types";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "better-auth";
import { Metadata } from "next";
import { headers } from "next/headers";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;

  const autoRouteType = await getAutoRouteType(id);

  if (!autoRouteType)
    return {
      title: `Edit ${autoRouteTypesTitle.label.singular.toLowerCase()}: "Unknown"`,
    };

  return {
    title: `Edit ${autoRouteTypesTitle.label.singular.toLowerCase()}: "${autoRouteType.name}"`,
  };
}

const EditResourceTypePage = async ({ params }: Props) => {
  const id = (await params).id;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  redirectNonAdminUsers({ to: `${autoRouteTypesTitle.href}/${id}`, session });

  const autoRouteType = await getAutoRouteType(id);

  if (!autoRouteType)
    return (
      <PageStructure>
        <PageBreadcrumbs
          crumbs={breadCrumbsFn([
            {
              href: autoRouteTypesTitle.href,
              label: capitalizeFirstLetter(
                capitalizeFirstLetter(
                  autoRouteTypesTitle.label.plural.toLowerCase(),
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
          backBtnHref={`${autoRouteTypesTitle.href}`}
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
            href: autoRouteTypesTitle.href,
            label: capitalizeFirstLetter(
              autoRouteTypesTitle.label.plural.toLowerCase(),
            ),
          },
          {
            href: `${autoRouteTypesTitle.href}/${id}`,
            label: autoRouteType.name,
          },
          {
            label: `Edit ${autoRouteTypesTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />

      <PageTitle
        label={`Edit "${autoRouteType.name}"`}
        backBtnHref={`${autoRouteTypesTitle.href}/${id}`}
        session={session}
      />

      <FormCardWrapper
        data={{
          type: "edit",
          routeType: autoRouteType,
        }}
      />

      {/* <div>
        <pre>{JSON.stringify({ trait }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default EditResourceTypePage;
