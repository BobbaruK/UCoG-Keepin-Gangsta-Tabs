import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
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
import { getBuilding } from "@/features/buildings/data/get";
import { getCrewMembers } from "@/features/crew-members/data/get";
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
    buildingId: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { buildingId, playthroughId } = await params;

  const playthrough = await getPlaythrough(playthroughId);

  if (!playthrough) {
    return {
      title: `${capitalizeFirstLetter(
        playthroughTitle.label.singular.toLowerCase(),
      )}: "Unknown"`,
    };
  }

  const building = await getBuilding(buildingId);

  if (!building) {
    return {
      title: `Edit ${buildingTitle.label.singular.toLowerCase()}: "Unknown"`,
    };
  }

  return {
    title: `Edit ${buildingTitle.label.singular.toLowerCase()}: "${building.name}"`,
  };
}

const EditCrewMemberPage = async ({ params }: Props) => {
  const { buildingId, playthroughId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const playthrough = await getPlaythrough(playthroughId);

  if (!playthrough) return <PlaythroughError session={session} />;

  redirectNonOwnerUsers({
    isOwner: session?.user.id === playthrough.auth_userId,
    to: `${playthroughTitle.href}/${playthrough.id + buildingTitle.href}/${buildingId}`,
  });

  redirectPlaythroughFinished({
    isFinished: playthrough.is_finished,
    to: `${playthroughTitle.href}/${playthrough.id + buildingTitle.href}/${buildingId}`,
  });

  const building = await getBuilding(buildingId);

  if (!building)
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
              href: `${playthroughTitle.href}/${playthroughId + buildingTitle.href}`,
              label: capitalizeFirstLetter(
                buildingTitle.label.plural.toLowerCase(),
              ),
            },
            {
              label: "Unknown",
            },
          ])}
        />

        <PageTitle
          label={"Unknown"}
          backBtnHref={`${playthroughTitle.href}/${playthroughId + buildingTitle.href}`}
          session={session}
        />

        <CustomAlert
          title={"Error!"}
          description={MESSAGES.RESOURCE_NOT_EXISTS}
          variant="danger"
        />
      </PageStructure>
    );

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
            label: playthrough.name,
          },
          {
            href: `${playthroughTitle.href}/${playthroughId + buildingTitle.href}`,
            label: capitalizeFirstLetter(
              buildingTitle.label.plural.toLowerCase(),
            ),
          },
          {
            href: `${playthroughTitle.href}/${playthroughId + buildingTitle.href}/${building.id}`,
            label: building.name,
          },
          {
            href: `${playthroughTitle.href}/${playthroughId + buildingTitle.href}/${building.id}/edit`,
            label: `Edit ${buildingTitle.label.singular.toLowerCase()}`,
          },
        ])}
      />

      <PageTitle
        label={`Edit "${building.name}"`}
        backBtnHref={`${playthroughTitle.href}/${playthroughId + buildingTitle.href}/${building.id}`}
        session={session}
      />

      <PlaythroughMenu playthroughId={playthrough.id} />

      <FormCardWrapper
        data={{
          type: "edit",
          buildingSizes: buildingSizes?.data,
          buildingTypes: buildingTypes?.data,
          buildingBackrooms: buildingBackrooms?.data,
          crewMembers: crewMembers?.data,
          passiveProductions: productionPassives?.data,
          productionDurations: productionDurations?.data,
          building,
        }}
      />

      {/* <div>
        <pre>{JSON.stringify(crewMember, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default EditCrewMemberPage;
