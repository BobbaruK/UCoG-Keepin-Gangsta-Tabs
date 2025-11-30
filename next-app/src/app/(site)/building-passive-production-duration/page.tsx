import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { loadSearchParams } from "@/components/search-params";
import { buildingPassiveDurationTitle } from "@/constants/page-title/building-passive-duration";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { DataTableTransitionWrapper } from "@/features/building-passive-durations/components/tables/data-table-transition-wrapper";
import { getBuildingPassiveDurations } from "@/features/building-passive-durations/data/get-building-passive-durations";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Metadata } from "next";
import { headers } from "next/headers";
import { SearchParams } from "nuqs/server";

interface Props {
  searchParams: Promise<SearchParams>;
}

export const metadata: Metadata = {
  title: capitalizeFirstLetter(
    buildingPassiveDurationTitle.label.plural.toLowerCase(),
  ),
};

const BuildingPassiveDurationPage = async ({ searchParams }: Props) => {
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

  const buildingPassiveDurations = await getBuildingPassiveDurations({
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

  const selectedBuildingPassiveDurations = await getBuildingPassiveDurations({
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
            href: buildingPassiveDurationTitle.href,
            label: capitalizeFirstLetter(
              buildingPassiveDurationTitle.label.plural,
            ),
          },
        ])}
      />

      <PageTitle
        label={buildingPassiveDurationTitle.label.plural}
        addBtnHref={`${buildingPassiveDurationTitle.href}/add`}
        session={session}
      />

      <DataTableTransitionWrapper
        data={buildingPassiveDurations?.data || []}
        dataCount={buildingPassiveDurations?.count || 0}
        dataSelected={selectedBuildingPassiveDurations?.data || []}
      />

      {/* <div>
        <pre>{JSON.stringify({ buildingPassiveDurations }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default BuildingPassiveDurationPage;
