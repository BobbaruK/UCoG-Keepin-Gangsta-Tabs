import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { loadSearchParams } from "@/components/search-params";
import { traitsTitle } from "@/constants/page-title/traits";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { DataTableTransitionWrapper } from "@/features/traits/components/tables/data-table-transition-wrapper";
import { getTraits } from "@/features/traits/data/get";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Metadata } from "next";
import { headers } from "next/headers";
import { SearchParams } from "nuqs/server";

interface Props {
  searchParams: Promise<SearchParams>;
}

export const metadata: Metadata = {
  title: traitsTitle.label.plural,
};

const TraitsPage = async ({ searchParams }: Props) => {
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

  const traits = await getTraits({
    pageNumber: pageIndex,
    perPage: pageSize,
    orderBy: {
      ...(sortBy === "sideEffect"
        ? {
            sideEffect: {
              value: sort,
            },
          }
        : { [sortBy]: sort }),
    },
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
  });

  const selectedTraits = await getTraits({
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
            href: traitsTitle.href,
            label: capitalizeFirstLetter(traitsTitle.label.plural),
          },
        ])}
      />

      <PageTitle
        label={traitsTitle.label.plural}
        addBtnHref={`${traitsTitle.href}/add`}
        session={session}
      />

      <DataTableTransitionWrapper
        data={traits?.data || []}
        dataCount={traits?.count || 0}
        dataSelected={selectedTraits?.data || []}
      />

      {/* <div>
        <pre>{JSON.stringify({ traits }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default TraitsPage;
