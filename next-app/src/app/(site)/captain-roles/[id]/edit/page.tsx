import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { captainRolesTitle } from "@/constants/page-title/captain-roles";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import FormCardWrapper from "@/features/captain-roles/components/form-card-wrapper";
import { getCaptainRole } from "@/features/captain-roles/data/get";
import { getSideEffects } from "@/features/side-effects/data/get-side-effects";
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

  const captainRole = await getCaptainRole(id);

  if (!captainRole)
    return {
      title: `Edit ${captainRolesTitle.label.singular.toLowerCase()}: "Unknown"`,
    };

  return {
    title: `Edit ${captainRolesTitle.label.singular.toLowerCase()}: "${captainRole.name}"`,
  };
}

const EditResourceTypePage = async ({ params }: Props) => {
  const id = (await params).id;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  redirectNonAdminUsers({ to: `${captainRolesTitle.href}/${id}`, session });

  const captainRole = await getCaptainRole(id);

  const sideEffects = await getSideEffects();

  if (!captainRole)
    return (
      <PageStructure>
        <PageBreadcrumbs
          crumbs={breadCrumbsFn([
            {
              href: captainRolesTitle.href,
              label: capitalizeFirstLetter(
                capitalizeFirstLetter(
                  captainRolesTitle.label.plural.toLowerCase(),
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
          backBtnHref={`${captainRolesTitle.href}`}
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
            href: captainRolesTitle.href,
            label: capitalizeFirstLetter(
              captainRolesTitle.label.plural.toLowerCase(),
            ),
          },
          {
            href: `${captainRolesTitle.href}/${id}`,
            label: captainRole.name,
          },
          {
            label: `Edit ${captainRolesTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />
      <PageTitle
        label={`Edit "${captainRole.name}"`}
        backBtnHref={`${captainRolesTitle.href}/${id}`}
        session={session}
      />

      <FormCardWrapper
        data={{
          type: "edit",
          role: captainRole,
          sideEffects: sideEffects?.data,
        }}
      />

      {/* <div>
        <pre>{JSON.stringify({ trait }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default EditResourceTypePage;
