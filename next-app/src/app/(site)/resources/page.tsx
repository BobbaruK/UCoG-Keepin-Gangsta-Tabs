import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { loadSearchParams } from "@/components/search-params";
import { resourcesTitle } from "@/constants/page-title/resources";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { DataTableTransitionWrapper } from "@/features/resources/components/tables/data-table-transition-wrapper";
import { getResources } from "@/features/resources/data/get";
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
  title: resourcesTitle.label.plural,
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

  const orderResourcesFn = (): Prisma.cog_resourceOrderByWithRelationInput => {
    switch (sortBy) {
      case "type":
        return {
          resource_type: {
            name: sort,
          },
        };

      case "capacity":
        return {
          resource_type: {
            capacity: sort,
          },
        };
      default:
        return {
          [sortBy]: sort,
        };
    }
  };

  const resources = await getResources({
    pageNumber: pageIndex,
    perPage: pageSize,
    orderBy: orderResourcesFn(),
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
  });

  const selectedResources = await getResources({
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
            href: resourcesTitle.href,
            label: capitalizeFirstLetter(resourcesTitle.label.plural),
          },
        ])}
      />

      <PageTitle
        label={resourcesTitle.label.plural}
        addBtnHref={`${resourcesTitle.href}/add`}
        session={session}
      />

      <DataTableTransitionWrapper
        data={resources?.data || []}
        dataCount={resources?.count || 0}
        dataSelected={selectedResources?.data || []}
      />

      {/* <div>
        <pre>{JSON.stringify({ resources }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default ResourceTypesPage;
