import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { loadSearchParams } from "@/components/search-params";
import { crewLevelsTitle } from "@/constants/page-title/crew-levels";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { DataTableTransitionWrapper } from "@/features/crew-levels/components/tables/data-table-transition-wrapper";
import { getCrewLevels } from "@/features/crew-levels/data/get";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Metadata } from "next";
import { headers } from "next/headers";
import { SearchParams } from "nuqs/server";

interface Props {
  searchParams: Promise<SearchParams>;
}

export const metadata: Metadata = {
  title: crewLevelsTitle.label.plural,
};

const CrewLevelsPage = async ({ searchParams }: Props) => {
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

  const crewLevels = await getCrewLevels({
    pageNumber: pageIndex,
    perPage: pageSize,
    orderBy: { [sortBy]: sort },
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
  });

  const selectedCrewLevels = await getCrewLevels({
    where: {
      id: {
        in: selected || [],
      },
    },
    perPage: -1,
  });

  return (
    <PageStructure>
      <PageBreadcrumbs
        crumbs={breadCrumbsFn([
          {
            href: crewLevelsTitle.href,
            label: capitalizeFirstLetter(crewLevelsTitle.label.plural),
          },
        ])}
      />
      <PageTitle
        label={crewLevelsTitle.label.plural}
        addBtnHref={`${crewLevelsTitle.href}/add`}
        session={session}
      />

      <DataTableTransitionWrapper
        data={crewLevels?.data || []}
        dataCount={crewLevels?.count || 0}
        dataSelected={selectedCrewLevels?.data || []}
      />

      {/* <div>
        <pre>{JSON.stringify({ crewLevels }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default CrewLevelsPage;
