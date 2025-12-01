import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { buildingTitle } from "@/constants/page-title/building";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { redirectNonOwnerUsers } from "@/core/admin/lib/redirect-non-owner-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { redirectPlaythroughFinished } from "@/core/cog/playthrough/utils/redirect-playthrough-finished";
import { getBuildingBackrooms } from "@/features/building-backrooms/data/get-building-backrooms";
import { getBuildingPassiveDurations } from "@/features/building-passive-durations/data/get-building-passive-durations";
import { getBuildingPassives } from "@/features/building-passive/data/get-building-passives";
import { getBuildingSizes } from "@/features/building-sizes/data/get-building-sizes";
import { getBuildingTypes } from "@/features/building-types/data/get-building-types";
import FormCardWrapper from "@/features/buildings/components/form-card-wrapper";
import { getCrewMembers } from "@/features/crew-members/data/get";
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
    title: `Add ${buildingTitle.label.singular.toLowerCase()}`,
  };
}

const AddBuildingPage = async ({ params }: Props) => {
  const playthroughId = (await params).playthroughId;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const playthrough = await getPlaythrough(playthroughId);

  if (!playthrough) return <PlaythroughError session={session} />;

  redirectNonOwnerUsers({
    isOwner: session?.user.id === playthrough.auth_userId,
    to: `${playthroughTitle.href}/${playthroughId + buildingTitle.href}`,
  });

  redirectPlaythroughFinished({
    isFinished: playthrough.is_finished,
    to: `${playthroughTitle.href}/${playthrough.id + buildingTitle.href}`,
  });

  const buildingSizes = await getBuildingSizes();
  const buildingTypes = await getBuildingTypes();
  const buildingBackrooms = await getBuildingBackrooms();
  const crewMembers = await getCrewMembers({
    where: {
      cog_playthroughId: {
        equals: playthrough.id,
      },
    },
  });
  const productionDurations = await getBuildingPassiveDurations();
  const productionPassives = await getBuildingPassives();

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
            href: `${playthroughTitle.href}/${playthroughId + buildingTitle.href}`,
            label: capitalizeFirstLetter(
              buildingTitle.label.plural.toLowerCase(),
            ),
          },
          {
            href: `${playthroughTitle.href}/${playthroughId + buildingTitle.href}`,
            label: `Add ${buildingTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />

      <PageTitle
        label={`Add ${buildingTitle.label.singular.toLowerCase()}`}
        backBtnHref={`${playthroughTitle.href}/${playthroughId + buildingTitle.href}`}
        session={session}
      />

      <PlaythroughMenu playthroughId={playthroughId} />

      <FormCardWrapper
        data={{
          type: "add",
          playthrough,
          buildingSizes: buildingSizes?.data,
          buildingTypes: buildingTypes?.data,
          buildingBackrooms: buildingBackrooms?.data,
          crewMembers: crewMembers?.data,
          passiveProductions: productionPassives?.data,
          productionDurations: productionDurations?.data,
        }}
      />

      {/* <div>
        <pre>{JSON.stringify({ sideEffects }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default AddBuildingPage;
