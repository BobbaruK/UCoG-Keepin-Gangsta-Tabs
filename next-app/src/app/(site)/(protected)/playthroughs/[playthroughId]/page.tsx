import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { playthroughTitle } from "@/constants/page-title/playtrough";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { getCrewMembers } from "@/features/crew-members/data/get";
import PlaythroughMenu from "@/features/playtroughs/components/playthrough-menu-wrapper";
import PlaythroughPresentation from "@/features/playtroughs/components/playthrough-presentation";
import { getPlaythrough } from "@/features/playtroughs/data/get";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "better-auth";
import type { Metadata } from "next";
import { headers } from "next/headers";

interface Props {
  params: Promise<{
    playthroughId: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).playthroughId;

  const playthrough = await getPlaythrough(id);

  return {
    title: playthrough?.name,
  };
}

const LawPage = async ({ params }: Props) => {
  const id = (await params).playthroughId;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const playthrough = await getPlaythrough(id);

  if (!playthrough)
    return (
      <PageStructure>
        <PageTitle
          label={"unknown"}
          backBtnHref={playthroughTitle.href}
          session={session}
        />
        <CustomAlert
          title={"Error!"}
          description={MESSAGES.RESOURCE_NOT_EXISTS}
          variant="danger"
        />
      </PageStructure>
    );

  const boss = await getCrewMembers({
    where: {
      cog_playthroughId: playthrough.id,
      is_boss: true,
    },
  });

  return (
    <PageStructure>
      <PageBreadcrumbs
        crumbs={breadCrumbsFn([
          {
            href: playthroughTitle.href,
            label: capitalizeFirstLetter(playthroughTitle.label.plural),
          },
          {
            href: `${playthroughTitle.href}/${id}`,
            label: playthrough.name,
          },
        ])}
      />
      <PageTitle
        label={playthrough.name}
        backBtnHref={playthroughTitle.href}
        editBtnHref={`${playthroughTitle.href}/${id}/edit`}
        forceEditButton
        session={session}
      />

      <PlaythroughMenu playthroughId={playthrough.id} />

      <PlaythroughPresentation type="detailed" playthrough={playthrough} />

      <div>
        <pre>{JSON.stringify(playthrough, null, 2)}</pre>
      </div>
    </PageStructure>
  );
};

export default LawPage;
