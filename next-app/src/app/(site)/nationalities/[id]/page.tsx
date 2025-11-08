import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { nationalitiesTitle } from "@/constants/page-title/nationalities";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import NationalityPresentation from "@/features/nationalities/components/nationality-presentation";
import { getNationality } from "@/features/nationalities/data/get-nationalities";
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

  const nationality = await getNationality(id);

  return {
    title: nationality?.name,
  };
}

const LawPage = async ({ params }: Props) => {
  const id = (await params).id;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const nationality = await getNationality(id);

  if (!nationality)
    return (
      <PageStructure>
        <PageTitle
          label={"unknown"}
          backBtnHref={nationalitiesTitle.href}
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
            label: capitalizeFirstLetter(nationalitiesTitle.label.plural),
          },
          {
            href: `${nationalitiesTitle.href}/${id}`,
            label: nationality.name,
          },
        ])}
      />
      <PageTitle
        label={nationality.name}
        backBtnHref={nationalitiesTitle.href}
        editBtnHref={`${nationalitiesTitle.href}/${id}/edit`}
        session={session}
      />

      <NationalityPresentation nationality={nationality} />

      <div>TODO: tables here - ward, crew_member</div>
    </PageStructure>
  );
};

export default LawPage;
