import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { loadSearchParams } from "@/components/search-params";
import { resourceTypesTitle } from "@/constants/page-title/resource-types";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { DataTableTransitionWrapper } from "@/features/resource-types/components/tables/data-table-transition-wrapper";
import { getResourceTypes } from "@/features/resource-types/data/get-resource-types";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Metadata } from "next";
import { headers } from "next/headers";
import { SearchParams } from "nuqs/server";

interface Props {
  searchParams: Promise<SearchParams>;
}

export const metadata: Metadata = {
  title: resourceTypesTitle.label.plural,
};

const ResourceTypesPage = async ({ searchParams }: Props) => {
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

  const resourceTypes = await getResourceTypes({
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

  const selectedResourceTypes = await getResourceTypes({
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
            href: resourceTypesTitle.href,
            label: capitalizeFirstLetter(resourceTypesTitle.label.plural),
          },
        ])}
      />
      <PageTitle
        label={resourceTypesTitle.label.plural}
        addBtnHref={`${resourceTypesTitle.href}/add`}
        session={session}
      />

      <DataTableTransitionWrapper
        data={resourceTypes?.data || []}
        dataCount={resourceTypes?.count || 0}
        dataSelected={selectedResourceTypes?.data || []}
      />

      {/* <div>
        <pre>{JSON.stringify({ vehicleTypes }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default ResourceTypesPage;
