import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { resourceTypesTitle } from "@/constants/page-title/resource-types";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import ResourceTypePresentation from "@/features/resource-types/components/resource-type-presentation";
import { getResourceType } from "@/features/resource-types/data/get-resource-types";
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

  const resourceType = await getResourceType(id);

  return {
    title: resourceType?.name,
  };
}

const VehicleTypePage = async ({ params }: Props) => {
  const id = (await params).id;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const resourceType = await getResourceType(id);

  if (!resourceType)
    return (
      <PageStructure>
        <PageTitle
          label={"unknown"}
          backBtnHref={resourceTypesTitle.href}
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
            href: resourceTypesTitle.href,
            label: capitalizeFirstLetter(
              resourceTypesTitle.label.plural.toLowerCase(),
            ),
          },
          {
            href: `${resourceTypesTitle.href}/${id}`,
            label: resourceType.name,
          },
        ])}
      />
      <PageTitle
        label={resourceType.name}
        backBtnHref={resourceTypesTitle.href}
        editBtnHref={`${resourceTypesTitle.href}/${id}/edit`}
        session={session}
      />

      <ResourceTypePresentation resourceType={resourceType} />

      <div>TODO: tables here - resource</div>
    </PageStructure>
  );
};

export default VehicleTypePage;
