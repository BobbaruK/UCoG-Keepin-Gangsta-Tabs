import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { MESSAGES } from "@/constants/messages";
import { resourcesTitle } from "@/constants/page-title/resources";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { getResourceTypes } from "@/features/resource-types/data/get-resource-types";
import FormCardWrapper from "@/features/resources/components/form-card-wrapper";
import EditResourceForm from "@/features/resources/components/form/edit";
import { getResource } from "@/features/resources/data/get";
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

  const resource = await getResource(id);

  if (!resource) return { title: "Unknown" };

  return {
    title: `Edit ${resource.name}`,
  };
}

const EditResourceTypePage = async ({ params }: Props) => {
  const id = (await params).id;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  redirectNonAdminUsers({ to: `${resourcesTitle.href}/${id}`, session });

  const resource = await getResource(id);

  const resourceTypes = await getResourceTypes({});

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
          backBtnHref={`${resourcesTitle.href}`}
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
            label: capitalizeFirstLetter(
              resourcesTitle.label.plural.toLowerCase(),
            ),
          },
          {
            href: `${resourcesTitle.href}/${id}`,
            label: resource.name,
          },
          {
            label: `Edit ${resourcesTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />

      <PageTitle
        label={`Edit "${resource.name}"`}
        backBtnHref={`${resourcesTitle.href}/${id}`}
        session={session}
      />

      <FormCardWrapper
        data={{
          type: "edit",
          resource,
          resourceTypes: resourceTypes?.data || [],
        }}
      />

      {/* <div>
        <pre>{JSON.stringify({ trait }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default EditResourceTypePage;
