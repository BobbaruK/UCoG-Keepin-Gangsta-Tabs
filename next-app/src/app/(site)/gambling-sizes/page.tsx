import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { loadSearchParams } from "@/components/search-params";
import { gamblingSizeTitle } from "@/constants/page-title/gambling-size";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { DataTableTransitionWrapper } from "@/features/gambling-sizes/components/tables/data-table-transition-wrapper";
import { getGamblingSizes } from "@/features/gambling-sizes/data/get-gambling-sizes";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Metadata } from "next";
import { headers } from "next/headers";
import { SearchParams } from "nuqs/server";

interface Props {
  searchParams: Promise<SearchParams>;
}

export const metadata: Metadata = {
  title: capitalizeFirstLetter(gamblingSizeTitle.label.plural.toLowerCase()),
};

const GamblingSizesPage = async ({ searchParams }: Props) => {
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

  const gamblingSizes = await getGamblingSizes({
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

  const selectedGamblingSizes = await getGamblingSizes({
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
            href: gamblingSizeTitle.href,
            label: capitalizeFirstLetter(gamblingSizeTitle.label.plural),
          },
        ])}
      />

      <PageTitle
        label={gamblingSizeTitle.label.plural}
        addBtnHref={`${gamblingSizeTitle.href}/add`}
        session={session}
      />

      <DataTableTransitionWrapper
        data={gamblingSizes?.data || []}
        dataCount={gamblingSizes?.count || 0}
        dataSelected={selectedGamblingSizes?.data || []}
      />

      {/* <div>
        <pre>{JSON.stringify({ gamblingSizes }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default GamblingSizesPage;
