import { CustomAlert } from "@/components/custom-alert";
import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { loadSearchParams } from "@/components/search-params";
import { MESSAGES } from "@/constants/messages";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { policeOfficersTitle } from "@/constants/page-title/police-officers";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import PlaythroughMenu from "@/features/playthroughs/components/playthrough-menu-wrapper";
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

export const metadata: Metadata = {
  title: policeOfficersTitle.label.plural,
};

const PolicePage = async ({ params, searchParams }: Props) => {
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

  const id = (await params).playthroughId;
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
        addBtnHref={`${playthroughTitle.href}/${playthrough.id + policeOfficersTitle.href}/add`}
        forceAddButton
        session={session}
      />

      {/* <PlaythroughPresentation playthrough={playthrough} /> */}

      <PlaythroughMenu playthroughId={playthrough.id} />

      <DataTableTransitionWrapper
        data={policeOfficers?.data || []}
        dataCount={policeOfficers?.count || 0}
        dataSelected={selectedPoliceOfficers?.data || []}
        respectForTheLaw={playthrough.respect_for_the_law}
      />

      <div>
        <pre>{JSON.stringify({ policeOfficers }, null, 2)}</pre>
      </div>
    </PageStructure>
  );
};

export default PolicePage;
