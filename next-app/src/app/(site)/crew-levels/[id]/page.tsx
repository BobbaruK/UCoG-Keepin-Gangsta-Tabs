import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { crewLevelsTitle } from "@/constants/page-title/crew-levels";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import LevelPresentation from "@/features/crew-levels/components/level-presentation";
import { getCrewLevel } from "@/features/crew-levels/data/get";
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

  const level = await getCrewLevel(id);

  return {
    title: level?.name,
  };
}

const CaptainRolePage = async ({ params }: Props) => {
  const id = (await params).id;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const level = await getCrewLevel(id);

  if (!level)
    return (
      <PageStructure>
        <PageTitle
          label={"unknown"}
          backBtnHref={crewLevelsTitle.href}
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
            label: capitalizeFirstLetter(crewLevelsTitle.label.plural),
          },
          {
            href: `${crewLevelsTitle.href}/${id}`,
            label: level.name,
          },
        ])}
      />
      <PageTitle
        label={level.name}
        backBtnHref={crewLevelsTitle.href}
        editBtnHref={`${crewLevelsTitle.href}/${id}/edit`}
        session={session}
      />

      <LevelPresentation level={level} />
    </PageStructure>
  );
};

export default CaptainRolePage;
