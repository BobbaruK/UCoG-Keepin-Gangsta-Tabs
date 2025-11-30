import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { loadSearchParams } from "@/components/search-params";
import { buildingBackroomsTitle } from "@/constants/page-title/building-backrooms";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { DataTableTransitionWrapper } from "@/features/building-backrooms/components/tables/data-table-transition-wrapper";
import { getBuildingBackrooms } from "@/features/building-backrooms/data/get-building-backrooms";
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
    buildingBackroomsTitle.label.plural.toLowerCase(),
  ),
};

const BuildingBackroomsPage = async ({ searchParams }: Props) => {
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

  const buildingBackrooms = await getBuildingBackrooms({
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

  const selectedBuildingBackrooms = await getBuildingBackrooms({
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
            href: buildingBackroomsTitle.href,
            label: capitalizeFirstLetter(buildingBackroomsTitle.label.plural),
          },
        ])}
      />

      <PageTitle
        label={buildingBackroomsTitle.label.plural}
        addBtnHref={`${buildingBackroomsTitle.href}/add`}
        session={session}
      />

      <DataTableTransitionWrapper
        data={buildingBackrooms?.data || []}
        dataCount={buildingBackrooms?.count || 0}
        dataSelected={selectedBuildingBackrooms?.data || []}
      />

      {/* <div>
        <pre>{JSON.stringify({ buildingBackrooms }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default BuildingBackroomsPage;
