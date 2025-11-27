import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { loadSearchParams } from "@/components/search-params";
import { autoRouteTypesTitle } from "@/constants/page-title/auto-route-types";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { DataTableTransitionWrapper } from "@/features/auto-route-types/components/tables/data-table-transition-wrapper";
import { getAutoRouteTypes } from "@/features/auto-route-types/data/get-auto-route-types";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Metadata } from "next";
import { headers } from "next/headers";
import { SearchParams } from "nuqs/server";

interface Props {
  searchParams: Promise<SearchParams>;
}

export const metadata: Metadata = {
  title: capitalizeFirstLetter(autoRouteTypesTitle.label.plural.toLowerCase()),
};

const AutoRouteTypesPage = async ({ searchParams }: Props) => {
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

  const autoRouteTypes = await getAutoRouteTypes({
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

  const selectedAutoRouteTypes = await getAutoRouteTypes({
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
            href: autoRouteTypesTitle.href,
            label: capitalizeFirstLetter(autoRouteTypesTitle.label.plural),
          },
        ])}
      />

      <PageTitle
        label={autoRouteTypesTitle.label.plural}
        addBtnHref={`${autoRouteTypesTitle.href}/add`}
        session={session}
      />

      <DataTableTransitionWrapper
        data={autoRouteTypes?.data || []}
        dataCount={autoRouteTypes?.count || 0}
        dataSelected={selectedAutoRouteTypes?.data || []}
      />

      {/* <div>
        <pre>{JSON.stringify({ autoRouteTypes }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default AutoRouteTypesPage;
