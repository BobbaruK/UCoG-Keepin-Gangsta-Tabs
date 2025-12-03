import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { gamblingBuildingsTitle } from "@/constants/page-title/gambling-buildings";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { redirectNonOwnerUsers } from "@/core/admin/lib/redirect-non-owner-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { redirectPlaythroughFinished } from "@/core/cog/playthrough/utils/redirect-playthrough-finished";
import { getCrewMembers } from "@/features/crew-members/data/get";
import FormCardWrapper from "@/features/gambling-buildings/components/form-card-wrapper";
import { getGamblingBuilding } from "@/features/gambling-buildings/data/get";
import { getGamblingFeatures } from "@/features/gambling-features/data/get-gambling-features";
import { getGamblingSizes } from "@/features/gambling-sizes/data/get-gambling-sizes";
import PlaythroughError from "@/features/playthroughs/components/playthrough-error";
import PlaythroughMenu from "@/features/playthroughs/components/playthrough-menu-wrapper";
import { getPlaythrough } from "@/features/playthroughs/data/get";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "better-auth";
import { Metadata } from "next";
import { headers } from "next/headers";

interface Props {
  params: Promise<{
    playthroughId: string;
    gamblingBuildingId: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { gamblingBuildingId, playthroughId } = await params;

  const playthrough = await getPlaythrough(playthroughId);

  if (!playthrough) {
    return {
      title: `${capitalizeFirstLetter(
        playthroughTitle.label.singular.toLowerCase(),
      )}: "Unknown"`,
    };
  }

  const gamblingBuilding = await getGamblingBuilding(gamblingBuildingId);

  if (!gamblingBuilding) {
    return {
      title: `Edit ${gamblingBuildingsTitle.label.singular.toLowerCase()}: "Unknown"`,
    };
  }

  return {
    title: `Edit ${gamblingBuildingsTitle.label.singular.toLowerCase()}: "${gamblingBuilding.name}"`,
  };
}

const EditCrewMemberPage = async ({ params }: Props) => {
  const { gamblingBuildingId, playthroughId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const playthrough = await getPlaythrough(playthroughId);

  if (!playthrough) return <PlaythroughError session={session} />;

  redirectNonOwnerUsers({
    isOwner: session?.user.id === playthrough.auth_userId,
    to: `${playthroughTitle.href}/${playthrough.id + gamblingBuildingsTitle.href}/${gamblingBuildingId}`,
  });

  redirectPlaythroughFinished({
    isFinished: playthrough.is_finished,
    to: `${playthroughTitle.href}/${playthrough.id + gamblingBuildingsTitle.href}/${gamblingBuildingId}`,
  });

  const gamblingBuilding = await getGamblingBuilding(gamblingBuildingId);

  if (!gamblingBuilding)
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
              label: playthrough.name,
            },
            {
              href: `${playthroughTitle.href}/${playthroughId + gamblingBuildingsTitle.href}`,
              label: capitalizeFirstLetter(
                gamblingBuildingsTitle.label.plural.toLowerCase(),
              ),
            },
            {
              label: "Unknown",
            },
          ])}
        />

        <PageTitle
          label={"Unknown"}
          backBtnHref={`${playthroughTitle.href}/${playthroughId + gamblingBuildingsTitle.href}`}
          session={session}
        />

        <CustomAlert
          title={"Error!"}
          description={MESSAGES.RESOURCE_NOT_EXISTS}
          variant="danger"
        />
      </PageStructure>
    );

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
            label: playthrough.name,
          },
          {
            href: `${playthroughTitle.href}/${playthroughId + gamblingBuildingsTitle.href}`,
            label: capitalizeFirstLetter(
              gamblingBuildingsTitle.label.plural.toLowerCase(),
            ),
          },
          {
            href: `${playthroughTitle.href}/${playthroughId + gamblingBuildingsTitle.href}/${gamblingBuilding.id}`,
            label: gamblingBuilding.name,
          },
          {
            href: `${playthroughTitle.href}/${playthroughId + gamblingBuildingsTitle.href}/${gamblingBuilding.id}/edit`,
            label: `Edit ${gamblingBuildingsTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />

      <PageTitle
        label={`Edit "${gamblingBuilding.name}"`}
        backBtnHref={`${playthroughTitle.href}/${playthroughId + gamblingBuildingsTitle.href}/${gamblingBuilding.id}`}
        session={session}
      />

      <PlaythroughMenu playthroughId={playthrough.id} />

      <FormCardWrapper
        data={{
          type: "edit",
          gamblingBuilding: gamblingBuilding,
          crewMembers: crewMembers?.data,
          gamblingFeatures: gamblingFeatures?.data,
          gamblingSizes: gamblinsSizes?.data,
        }}
      />

      {/* <div>
        <pre>{JSON.stringify(crewMember, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default EditCrewMemberPage;
