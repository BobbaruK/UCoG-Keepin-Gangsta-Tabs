import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { MESSAGES } from "@/constants/messages";
import { crewLevelsTitle } from "@/constants/page-title/crew-levels";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import EditCaptainRoleForm from "@/features/captain-roles/components/form/edit";
import EditCrewLevelForm from "@/features/crew-levels/components/form/edit";
import { getCrewLevel } from "@/features/crew-levels/data/get";
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

  const level = await getCrewLevel(id);

  return {
    title: `Edit ${level?.name}`,
  };
}

const EditCrewLevelPage = async ({ params }: Props) => {
  const id = (await params).id;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  redirectNonAdminUsers({ to: `${crewLevelsTitle.href}/${id}`, session });

  const level = await getCrewLevel(id);

  if (!level)
    return (
      <PageStructure>
        <PageTitle
          label={"unknown"}
          backBtnHref={`${crewLevelsTitle.href}`}
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
            href: crewLevelsTitle.href,
            label: capitalizeFirstLetter(
              crewLevelsTitle.label.plural.toLowerCase(),
            ),
          },
          {
            href: `${crewLevelsTitle.href}/${id}`,
            label: level.name,
          },
          {
            label: `Edit ${crewLevelsTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />
      <PageTitle
        label={`Edit "${level.name}"`}
        backBtnHref={`${crewLevelsTitle.href}/${id}`}
        session={session}
      />

      <Card>
        <CardContent>
          <EditCrewLevelForm level={level} />
        </CardContent>
      </Card>

      {/* <div>
        <pre>{JSON.stringify({ trait }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default EditCrewLevelPage;
