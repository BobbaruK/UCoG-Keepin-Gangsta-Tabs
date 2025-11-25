import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { loadSearchParams } from "@/components/search-params";
import { nationalitiesTitle } from "@/constants/page-title/nationalities";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { DataTableTransitionWrapper } from "@/features/nationalities/components/tables/data-table-transition-wrapper";
import { getNationalities } from "@/features/nationalities/data/get-nationalities";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Metadata } from "next";
import { headers } from "next/headers";
import { SearchParams } from "nuqs/server";

interface Props {
  searchParams: Promise<SearchParams>;
}

export const metadata: Metadata = {
  title: nationalitiesTitle.label.plural,
};

const NationalitiesPage = async ({ searchParams }: Props) => {
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

  const nationalities = await getNationalities({
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

  const selectedNationalities = await getNationalities({
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
            href: nationalitiesTitle.href,
            label: capitalizeFirstLetter(nationalitiesTitle.label.plural),
          },
        ])}
      />

      <PageTitle
        label={nationalitiesTitle.label.plural}
        addBtnHref={`${nationalitiesTitle.href}/add`}
        session={session}
      />

      <DataTableTransitionWrapper
        data={nationalities?.data || []}
        dataCount={nationalities?.count || 0}
        dataSelected={selectedNationalities?.data || []}
      />

      {/* <div>
        <pre>{JSON.stringify({ nationalities }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default NationalitiesPage;
