import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { loadSearchParams } from "@/components/search-params";
import { gamblingFeatureTitle } from "@/constants/page-title/gambling-feature";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { DataTableTransitionWrapper } from "@/features/gambling-features/components/tables/data-table-transition-wrapper";
import { getGamblingFeatures } from "@/features/gambling-features/data/get-gambling-features";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Metadata } from "next";
import { headers } from "next/headers";
import { SearchParams } from "nuqs/server";

interface Props {
  searchParams: Promise<SearchParams>;
}

export const metadata: Metadata = {
  title: capitalizeFirstLetter(gamblingFeatureTitle.label.plural.toLowerCase()),
};

const GamblingFeaturesPage = async ({ searchParams }: Props) => {
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

  const gamblingFeatures = await getGamblingFeatures({
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

  const selectedGamblingFeatures = await getGamblingFeatures({
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
            href: gamblingFeatureTitle.href,
            label: capitalizeFirstLetter(gamblingFeatureTitle.label.plural),
          },
        ])}
      />

      <PageTitle
        label={gamblingFeatureTitle.label.plural}
        addBtnHref={`${gamblingFeatureTitle.href}/add`}
        session={session}
      />

      <DataTableTransitionWrapper
        data={gamblingFeatures?.data || []}
        dataCount={gamblingFeatures?.count || 0}
        dataSelected={selectedGamblingFeatures?.data || []}
      />

      <div>
        <pre>{JSON.stringify({ gamblingFeatures }, null, 2)}</pre>
      </div>
    </PageStructure>
  );
};

export default GamblingFeaturesPage;
