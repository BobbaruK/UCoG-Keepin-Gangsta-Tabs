import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import PlaythroughError from "@/features/playthroughs/components/playthrough-error";
import PlaythroughMenu from "@/features/playthroughs/components/playthrough-menu-wrapper";
import PlaythroughPresentation from "@/features/playthroughs/components/playthrough-presentation";
import { getPlaythrough } from "@/features/playthroughs/data/get";
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

  if (!playthrough)
    return {
      title: `${capitalizeFirstLetter(
        playthroughTitle.label.singular.toLowerCase(),
      )}: "Unknown"`,
    };

  return {
    title: `${capitalizeFirstLetter(
      playthroughTitle.label.singular.toLowerCase(),
    )}: "${playthrough.name}"`,
  };
}

const PlaythroughPage = async ({ params }: Props) => {
  const id = (await params).playthroughId;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const playthrough = await getPlaythrough(id);

  if (!playthrough) return <PlaythroughError session={session} />;

  // const boss = await getCrewMembers({
  //   where: {
  //     cog_playthroughId: playthrough.id,
  //     is_boss: true,
  //   },
  // });

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
        forceEditButton={session?.user.id === playthrough.auth_userId}
        session={session}
      />

      <PlaythroughMenu playthroughId={playthrough.id} />

      <PlaythroughPresentation
        session={session}
        type="detailed"
        playthrough={playthrough}
      />

      <div>
        <pre>{JSON.stringify(playthrough, null, 2)}</pre>
      </div>
    </PageStructure>
  );
};

export default PlaythroughPage;
