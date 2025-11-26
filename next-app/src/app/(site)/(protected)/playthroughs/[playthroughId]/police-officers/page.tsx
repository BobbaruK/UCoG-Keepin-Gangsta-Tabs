import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { loadSearchParams } from "@/components/search-params";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { policeOfficersTitle } from "@/constants/page-title/police-officers";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { getLaws } from "@/features/laws/data/get-laws";
import PlaythroughError from "@/features/playthroughs/components/playthrough-error";
import PlaythroughMenu from "@/features/playthroughs/components/playthrough-menu-wrapper";
import PlaythroughPresentation from "@/features/playthroughs/components/playthrough-presentation";
import { getPlaythrough } from "@/features/playthroughs/data/get";
import { DataTableTransitionWrapper } from "@/features/police-officers/components/tables/data-table-transition-wrapper";
import { getPoliceOfficers } from "@/features/police-officers/data/get";
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
      policeOfficersTitle.label.plural.toLowerCase(),
    ),
  };
}

const PoliceOfficersPage = async ({ params, searchParams }: Props) => {
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

  const orderBy = (): Prisma.cog_police_officerOrderByWithRelationInput => {
    switch (sortBy) {
      case "bribedTurn":
        return {
          bribed_turn: sort,
        };

      case "rivalRelative":
        return {
          has_rival_hooligan_relative: sort,
        };

      case "politicalContact":
        return {
          political_contact_used: sort,
        };

      case "callRaid":
        return {
          can_call_in_a_raid: sort,
        };

      default:
        return {
          [sortBy]: sort,
        };
    }
  };

  const playthrough = await getPlaythrough(id);

  const policeOfficers = await getPoliceOfficers({
    pageNumber: pageIndex,
    perPage: pageSize,
    orderBy: orderBy(),
    where: {
      cog_playthroughId: id,
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
  });

  const selectedPoliceOfficers = await getPoliceOfficers({
    where: {
      id: {
        in: selected || [],
      },
    },
    perPage: -1,
  });

  if (!playthrough) return <PlaythroughError session={session} />;

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
            href: `${playthroughTitle.href}/${id + policeOfficersTitle.href}`,
            label: capitalizeFirstLetter(
              policeOfficersTitle.label.plural.toLowerCase(),
            ),
          },
        ])}
      />

      <PageTitle
        label={capitalizeFirstLetter(
          policeOfficersTitle.label.plural.toLowerCase(),
        )}
        backBtnHref={`${playthroughTitle.href}/${playthrough.id}`}
        addBtnHref={
          !playthrough.is_finished
            ? `${playthroughTitle.href}/${playthrough.id + policeOfficersTitle.href}/add`
            : undefined
        }
        forceAddButton={!playthrough.is_finished}
        session={session}
      />

      <PlaythroughMenu playthroughId={playthrough.id} />

      <PlaythroughPresentation playthrough={playthrough} laws={laws?.data} />

      <DataTableTransitionWrapper
        data={policeOfficers?.data || []}
        dataCount={policeOfficers?.count || 0}
        dataSelected={selectedPoliceOfficers?.data || []}
        respectForTheLaw={playthrough.respect_for_the_law}
      />

      {/* <div>
        <pre>{JSON.stringify({ policeOfficers }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default PoliceOfficersPage;
