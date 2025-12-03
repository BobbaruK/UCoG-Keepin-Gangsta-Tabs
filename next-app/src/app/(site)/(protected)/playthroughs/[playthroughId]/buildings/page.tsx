import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { loadSearchParams } from "@/components/search-params";
import { buildingTitle } from "@/constants/page-title/building";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { DataTableTransitionWrapper } from "@/features/buildings/components/tables/data-table-transition-wrapper";
import { getBuildings } from "@/features/buildings/data/get";
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
    title: capitalizeFirstLetter(buildingTitle.label.plural.toLowerCase()),
  };
}

const BuildingsPage = async ({ params, searchParams }: Props) => {
  const id = (await params).playthroughId;

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

  const playthrough = await getPlaythrough(id);

  if (!playthrough) return <PlaythroughError session={session} />;

  const orderBuildingsFn = (): Prisma.cog_buildingOrderByWithRelationInput => {
    switch (sortBy) {
      case "type":
        return {
          type: {
            name: sort,
          },
        };

      case "size":
        return {
          size: {
            capacity: sort,
          },
        };

      case "manager":
        return {
          manager: {
            full_name: sort,
          },
        };

      case "backroom":
        return {
          backroom: {
            name: sort,
          },
        };

      case "passiveDuration":
        return {
          passive_productions_duration: {
            name: sort,
          },
        };

      default:
        return {
          [sortBy]: sort,
        };
    }
  };

  const buildings = await getBuildings({
    pageNumber: pageIndex,
    perPage: pageSize,
    orderBy: orderBuildingsFn(),
    where: {
      playthrough_id: id,
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
  });

  const selectedBuildings = await getBuildings({
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
            href: `${playthroughTitle.href}/${id}`,
            label: playthrough.name,
          },
          {
            href: `${playthroughTitle.href}/${id + buildingTitle.href}`,
            label: capitalizeFirstLetter(
              buildingTitle.label.plural.toLowerCase(),
            ),
          },
        ])}
      />

      <PageTitle
        label={capitalizeFirstLetter(buildingTitle.label.plural.toLowerCase())}
        backBtnHref={`${playthroughTitle.href}/${playthrough.id}`}
        addBtnHref={
          !playthrough.is_finished
            ? `${playthroughTitle.href}/${playthrough.id + buildingTitle.href}/add`
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
        data={buildings?.data || []}
        dataCount={buildings?.count || 0}
        dataSelected={selectedBuildings?.data || []}
      />

      {/* <div>
        <pre>{JSON.stringify({ buildings }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default BuildingsPage;
