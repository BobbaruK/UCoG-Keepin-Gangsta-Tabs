import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { loadSearchParams } from "@/components/search-params";
import { buildingSizesTitle } from "@/constants/page-title/building-sizes";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { DataTableTransitionWrapper } from "@/features/building-sizes/components/tables/data-table-transition-wrapper";
import { getBuildingSizes } from "@/features/building-sizes/data/get-building-sizes";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Metadata } from "next";
import { headers } from "next/headers";
import { SearchParams } from "nuqs/server";

interface Props {
  searchParams: Promise<SearchParams>;
}

export const metadata: Metadata = {
  title: capitalizeFirstLetter(buildingSizesTitle.label.plural.toLowerCase()),
};

const BuildingSizesPage = async ({ searchParams }: Props) => {
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

  const buildingSizes = await getBuildingSizes({
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

  const selectedBuildingSizes = await getBuildingSizes({
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
            href: buildingSizesTitle.href,
            label: capitalizeFirstLetter(buildingSizesTitle.label.plural),
          },
        ])}
      />

      <PageTitle
        label={buildingSizesTitle.label.plural}
        addBtnHref={`${buildingSizesTitle.href}/add`}
        session={session}
      />

      <DataTableTransitionWrapper
        data={buildingSizes?.data || []}
        dataCount={buildingSizes?.count || 0}
        dataSelected={selectedBuildingSizes?.data || []}
      />

      {/* <div>
        <pre>{JSON.stringify({ buildingSizes }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default BuildingSizesPage;
