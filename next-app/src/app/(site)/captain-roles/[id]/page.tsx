import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { captainRolesTitle } from "@/constants/page-title/captain-roles";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import RolePresentation from "@/features/captain-roles/components/role-presentation";
import { getCaptainRole } from "@/features/captain-roles/data/get";
import ResourcePresentation from "@/features/resources/components/resource-presentation";
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

  const captainRole = await getCaptainRole(id);

  return {
    title: captainRole?.name,
  };
}

const CaptainRolePage = async ({ params }: Props) => {
  const id = (await params).id;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const captainRole = await getCaptainRole(id);

  if (!captainRole)
    return (
      <PageStructure>
        <PageTitle
          label={"unknown"}
          backBtnHref={captainRolesTitle.href}
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
            label: capitalizeFirstLetter(captainRolesTitle.label.plural),
          },
          {
            href: `${captainRolesTitle.href}/${id}`,
            label: captainRole.name,
          },
        ])}
      />
      <PageTitle
        label={captainRole.name}
        backBtnHref={captainRolesTitle.href}
        editBtnHref={`${captainRolesTitle.href}/${id}/edit`}
        session={session}
      />

      <RolePresentation captainRole={captainRole} />
    </PageStructure>
  );
};

export default CaptainRolePage;
