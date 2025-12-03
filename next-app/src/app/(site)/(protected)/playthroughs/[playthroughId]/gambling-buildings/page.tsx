import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { loadSearchParams } from "@/components/search-params";
import { gamblingBuildingsTitle } from "@/constants/page-title/gambling-buildings";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { DataTableTransitionWrapper } from "@/features/gambling-buildings/components/tables/data-table-transition-wrapper";
import { getGamblingBuildings } from "@/features/gambling-buildings/data/get";
import { getLaws } from "@/features/laws/data/get-laws";
import PlaythroughError from "@/features/playthroughs/components/playthrough-error";
import PlaythroughMenu from "@/features/playthroughs/components/playthrough-menu-wrapper";
import PlaythroughPeak from "@/features/playthroughs/components/playthrough-peak";
import { getPlaythrough } from "@/features/playthroughs/data/get";
import { Prisma } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "better-auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { SearchParams } from "nuqs/server";

interface Props {
  params: Promise<{
    playthroughId: string;
  }>;
  searchParams: Promise<SearchParams>;
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
    title: capitalizeFirstLetter(
      gamblingBuildingsTitle.label.plural.toLowerCase(),
    ),
  };
}

const GamblingBuildingsPage = async ({ params, searchParams }: Props) => {
  const { playthroughId } = await params;

  const {
    // pagination
    pageIndex,
    pageSize,
    // sorting
    sortBy,
    sort,
    // filtering
    search,
    // Select
    selected,
  } = await loadSearchParams(searchParams);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const orderBy = (): Prisma.cog_gambling_buildingOrderByWithRelationInput => {
    switch (sortBy) {
      default:
        return {
          [sortBy]: sort,
        };
    }
  };

  const playthrough = await getPlaythrough(playthroughId);

  if (!playthrough) return <PlaythroughError session={session} />;

  const gamblingBuildings = await getGamblingBuildings({
    pageNumber: pageIndex,
    perPage: pageSize,
    orderBy: orderBy(),
    where: {
      playthrough_id: playthroughId,
      // name: {
      //   contains: search,
      //   mode: "insensitive",
      // },
    },
  });

  const selectedGamblingBuildings = await getGamblingBuildings({
    where: {
      id: {
        in: selected || [],
      },
    },
    perPage: -1,
  });

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
            href: `${playthroughTitle.href}/${playthroughId + gamblingBuildingsTitle.href}`,
            label: capitalizeFirstLetter(
              gamblingBuildingsTitle.label.plural.toLowerCase(),
            ),
          },
        ])}
      />
      <PageTitle
        label={capitalizeFirstLetter(
          gamblingBuildingsTitle.label.plural.toLowerCase(),
        )}
        backBtnHref={`${playthroughTitle.href}/${playthrough.id}`}
        addBtnHref={
          !playthrough.is_finished
            ? `${playthroughTitle.href}/${playthrough.id + gamblingBuildingsTitle.href}/add`
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

      <DataTableTransitionWrapper
        data={gamblingBuildings?.data || []}
        dataCount={gamblingBuildings?.count || 0}
        dataSelected={selectedGamblingBuildings?.data || []}
      />
      {/* <div>
        <pre>{JSON.stringify({ gamblingBuildings }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default GamblingBuildingsPage;
