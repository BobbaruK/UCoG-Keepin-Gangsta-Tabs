import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { MESSAGES } from "@/constants/messages";
import { buildingTitle } from "@/constants/page-title/building";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { getBuilding } from "@/features/buildings/data/get";
import { getLaws } from "@/features/laws/data/get-laws";
import PlaythroughError from "@/features/playthroughs/components/playthrough-error";
import PlaythroughMenu from "@/features/playthroughs/components/playthrough-menu-wrapper";
import PlaythroughPeak from "@/features/playthroughs/components/playthrough-peak";
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
      title: `${capitalizeFirstLetter(
        buildingTitle.label.singular.toLowerCase(),
      )}: "Unknown"`,
    };
  }

  return {
    title: `${capitalizeFirstLetter(
      buildingTitle.label.singular.toLowerCase(),
    )}: "${building.name}"`,
  };
}

const BuildingPage = async ({ params }: Props) => {
  const { playthroughId, buildingId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const playthrough = await getPlaythrough(playthroughId);

  if (!playthrough) return <PlaythroughError session={session} />;

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

  const laws = await getLaws();

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
        ])}
      />
      <PageTitle
        label={building.name}
        backBtnHref={`${playthroughTitle.href}/${playthroughId + buildingTitle.href}`}
        editBtnHref={
          !playthrough.is_finished
            ? `${playthroughTitle.href}/${playthroughId + buildingTitle.href}/${building.id}/edit`
            : undefined
        }
        session={session}
      />

      <PlaythroughMenu playthroughId={playthrough.id} />

      <PlaythroughPeak
        session={session}
        playthrough={playthrough}
        laws={laws?.data}
      />

      <div>
        <pre>{JSON.stringify(building, null, 2)}</pre>
      </div>
    </PageStructure>
  );
};

export default BuildingPage;
