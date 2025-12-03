import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { gamblingBuildingsTitle } from "@/constants/page-title/gambling-buildings";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { redirectNonOwnerUsers } from "@/core/admin/lib/redirect-non-owner-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { redirectPlaythroughFinished } from "@/core/cog/playthrough/utils/redirect-playthrough-finished";
import { getCrewMembers } from "@/features/crew-members/data/get";
import FormCardWrapper from "@/features/gambling-buildings/components/form-card-wrapper";
import { getGamblingFeatures } from "@/features/gambling-features/data/get-gambling-features";
import { getGamblingSizes } from "@/features/gambling-sizes/data/get-gambling-sizes";
import PlaythroughError from "@/features/playthroughs/components/playthrough-error";
import PlaythroughMenu from "@/features/playthroughs/components/playthrough-menu-wrapper";
import { getPlaythrough } from "@/features/playthroughs/data/get";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Metadata } from "next";
import { headers } from "next/headers";

interface Props {
  params: Promise<{
    playthroughId: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { playthroughId } = await params;

  const playthrough = await getPlaythrough(playthroughId);

  if (!playthrough)
    return {
      title: `${capitalizeFirstLetter(
        playthroughTitle.label.singular.toLowerCase(),
      )}: "Unknown"`,
    };

  return {
    title: `Add ${gamblingBuildingsTitle.label.singular.toLowerCase()}`,
  };
}

const AddGamblingBuildingPage = async ({ params }: Props) => {
  const playthroughId = (await params).playthroughId;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const playthrough = await getPlaythrough(playthroughId);

  if (!playthrough) return <PlaythroughError session={session} />;

  redirectNonOwnerUsers({
    isOwner: session?.user.id === playthrough.auth_userId,
    to: `${playthroughTitle.href}/${playthroughId + gamblingBuildingsTitle.href}`,
  });

  redirectPlaythroughFinished({
    isFinished: playthrough.is_finished,
    to: `${playthroughTitle.href}/${playthrough.id + gamblingBuildingsTitle.href}`,
  });

  const crewMembers = await getCrewMembers({
    where: {
      cog_playthroughId: playthroughId,
    },
  });
  const gamblinsSizes = await getGamblingSizes();
  const gamblingFeatures = await getGamblingFeatures();

  return (
    <PageStructure>
      <PageBreadcrumbs
        crumbs={breadCrumbsFn([
          {
            href: playthroughTitle.href,
            label: capitalizeFirstLetter(playthroughTitle.label.plural),
          },
          {
            href: `${playthroughTitle.href}/${playthroughId}`,
            label: playthrough?.name || "",
          },
          {
            href: `${playthroughTitle.href}/${playthroughId + gamblingBuildingsTitle.href}`,
            label: capitalizeFirstLetter(
              gamblingBuildingsTitle.label.plural.toLowerCase(),
            ),
          },
          {
            href: `${playthroughTitle.href}/${playthroughId + gamblingBuildingsTitle.href}`,
            label: `Add ${gamblingBuildingsTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />

      <PageTitle
        label={`Add ${gamblingBuildingsTitle.label.singular.toLowerCase()}`}
        backBtnHref={`${playthroughTitle.href}/${playthroughId + gamblingBuildingsTitle.href}`}
        session={session}
      />

      <PlaythroughMenu playthroughId={playthroughId} />

      <FormCardWrapper
        data={{
          type: "add",
          playthrough,
          crewMembers: crewMembers?.data,
          gamblingSizes: gamblinsSizes?.data,
          gamblingFeatures: gamblingFeatures?.data,
        }}
      />

      {/* <div>
        <pre>{JSON.stringify({ sideEffects }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default AddGamblingBuildingPage;
