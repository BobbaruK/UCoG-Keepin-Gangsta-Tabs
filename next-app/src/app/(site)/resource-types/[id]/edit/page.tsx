import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { MESSAGES } from "@/constants/messages";
import { resourceTypesTitle } from "@/constants/page-title/resource-types";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import EditResourceTypeForm from "@/features/resource-types/components/form/edit";
import { getResourceType } from "@/features/resource-types/data/get-resource-types";
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

  const resourceType = await getResourceType(id);

  return {
    title: `Edit ${resourceType?.name}`,
  };
}

const EditResourceTypePage = async ({ params }: Props) => {
  const id = (await params).id;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  redirectNonAdminUsers({ to: `${resourceTypesTitle.href}/${id}`, session });

  const resourceType = await getResourceType(id);

  if (!resourceType)
    return (
      <PageStructure>
        <PageTitle
          label={"unknown"}
          backBtnHref={`/${resourceTypesTitle.href}`}
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
          {
            label: `Edit ${resourceTypesTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />
      <PageTitle
        label={`Edit "${resourceType.name}"`}
        backBtnHref={`${resourceTypesTitle.href}/${id}`}
        session={session}
      />

      <Card>
        <CardContent>
          <EditResourceTypeForm resourceType={resourceType} />
        </CardContent>
      </Card>

      {/* <div>
        <pre>{JSON.stringify({ trait }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default EditResourceTypePage;
