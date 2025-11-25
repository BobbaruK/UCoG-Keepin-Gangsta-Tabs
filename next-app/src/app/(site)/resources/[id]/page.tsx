import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { resourcesTitle } from "@/constants/page-title/resources";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import ResourcePresentation from "@/features/resources/components/resource-presentation";
import { getResource } from "@/features/resources/data/get";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "better-auth";
import type { Metadata } from "next";
import { headers } from "next/headers";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;

  const resource = await getResource(id);

  if (!resource)
    return {
      title: `${capitalizeFirstLetter(
        resourcesTitle.label.singular.toLowerCase(),
      )}: "Unknown"`,
    };

  return {
    title: `${capitalizeFirstLetter(
      resourcesTitle.label.singular.toLowerCase(),
    )}: "${resource.name}"`,
  };
}

const VehicleTypePage = async ({ params }: Props) => {
  const id = (await params).id;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const resource = await getResource(id);

  if (!resource)
    return (
      <PageStructure>
        <PageBreadcrumbs
          crumbs={breadCrumbsFn([
            {
              href: resourcesTitle.href,
              label: capitalizeFirstLetter(
                capitalizeFirstLetter(
                  resourcesTitle.label.plural.toLowerCase(),
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
          backBtnHref={resourcesTitle.href}
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
            href: resourcesTitle.href,
            label: capitalizeFirstLetter(resourcesTitle.label.plural),
          },
          {
            href: `${resourcesTitle.href}/${id}`,
            label: resource.name,
          },
        ])}
      />
      <PageTitle
        label={resource.name}
        backBtnHref={resourcesTitle.href}
        editBtnHref={`${resourcesTitle.href}/${id}/edit`}
        session={session}
      />

      <ResourcePresentation resource={resource} />

      <div>TODO: tables here - building_production, map</div>
    </PageStructure>
  );
};

export default VehicleTypePage;
