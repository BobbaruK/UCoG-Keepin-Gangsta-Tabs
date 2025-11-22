import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { MESSAGES } from "@/constants/messages";
import { nationalitiesTitle } from "@/constants/page-title/nationalities";
import { redirectNonAdminUsers } from "@/core/admin/lib/redirect-non-admin-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import EditNationalityForm from "@/features/nationalities/components/form/edit";
import { getNationality } from "@/features/nationalities/data/get-nationalities";
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

  const nationality = await getNationality(id);

  return {
    title: `Edit ${nationality?.name}`,
  };
}

const EditLawPage = async ({ params }: Props) => {
  const id = (await params).id;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  redirectNonAdminUsers({ to: `${nationalitiesTitle.href}/${id}`, session });

  const nationality = await getNationality(id);

  if (!nationality)
    return (
      <PageStructure>
        <PageTitle
          label={"unknown"}
          backBtnHref={`/${nationalitiesTitle.href}`}
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
            href: nationalitiesTitle.href,
            label: capitalizeFirstLetter(
              nationalitiesTitle.label.plural.toLowerCase(),
            ),
          },
          {
            href: `${nationalitiesTitle.href}/${id}`,
            label: nationality.name,
          },
          {
            label: `Edit ${nationalitiesTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />
      <PageTitle
        label={`Edit "${nationality.name}"`}
        backBtnHref={`${nationalitiesTitle.href}/${id}`}
        session={session}
      />

      <Card>
        <CardContent>
          <EditNationalityForm nationality={nationality} />
        </CardContent>
      </Card>

      {/* <div>
        <pre>{JSON.stringify({ trait }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default EditLawPage;
