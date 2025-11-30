import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { loadSearchParams } from "@/components/search-params";
import { buildingTypesTitle } from "@/constants/page-title/building-types";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { DataTableTransitionWrapper } from "@/features/building-types/components/tables/data-table-transition-wrapper";
import { getBuildingTypes } from "@/features/building-types/data/get-building-types";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Metadata } from "next";
import { headers } from "next/headers";
import { SearchParams } from "nuqs/server";

interface Props {
  searchParams: Promise<SearchParams>;
}

export const metadata: Metadata = {
  title: capitalizeFirstLetter(buildingTypesTitle.label.plural.toLowerCase()),
};

const BuildingTypesPage = async ({ searchParams }: Props) => {
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

  const buildingTypes = await getBuildingTypes({
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

  const selectedBuildingTypes = await getBuildingTypes({
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
            href: buildingTypesTitle.href,
            label: capitalizeFirstLetter(buildingTypesTitle.label.plural),
          },
        ])}
      />

      <PageTitle
        label={buildingTypesTitle.label.plural}
        addBtnHref={`${buildingTypesTitle.href}/add`}
        session={session}
      />

      <DataTableTransitionWrapper
        data={buildingTypes?.data || []}
        dataCount={buildingTypes?.count || 0}
        dataSelected={selectedBuildingTypes?.data || []}
      />

      {/* <div>
        <pre>{JSON.stringify({ buildingTypes }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default BuildingTypesPage;
