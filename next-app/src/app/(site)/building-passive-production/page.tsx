import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { loadSearchParams } from "@/components/search-params";
import { buildingPassiveTitle } from "@/constants/page-title/building-passive";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { DataTableTransitionWrapper } from "@/features/building-passive/components/tables/data-table-transition-wrapper";
import { getBuildingPassives } from "@/features/building-passive/data/get-building-passives";
import { Prisma } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Metadata } from "next";
import { headers } from "next/headers";
import { SearchParams } from "nuqs/server";

interface Props {
  searchParams: Promise<SearchParams>;
}

export const metadata: Metadata = {
  title: capitalizeFirstLetter(buildingPassiveTitle.label.plural.toLowerCase()),
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

  const orderResourcesFn =
    (): Prisma.cog_building_passive_productionOrderByWithRelationInput => {
      switch (sortBy) {
        case "resource":
          return {
            resource: {
              name: sort,
            },
          };

        default:
          return {
            [sortBy]: sort,
          };
      }
    };

  const buildingPassive = await getBuildingPassives({
    pageNumber: pageIndex,
    perPage: pageSize,
    orderBy: orderResourcesFn(),
    where: {
      // name: {
      //   contains: search,
      //   mode: "insensitive",
      // },
    },
  });

  const selectedBuildingPassive = await getBuildingPassives({
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
            href: buildingPassiveTitle.href,
            label: capitalizeFirstLetter(buildingPassiveTitle.label.plural),
          },
        ])}
      />

      <PageTitle
        label={buildingPassiveTitle.label.plural}
        addBtnHref={`${buildingPassiveTitle.href}/add`}
        session={session}
      />

      <DataTableTransitionWrapper
        data={buildingPassive?.data || []}
        dataCount={buildingPassive?.count || 0}
        dataSelected={selectedBuildingPassive?.data || []}
      />

      {/* <div>
        <pre>{JSON.stringify({ buildingPassive }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default BuildingPassiveDurationPage;
