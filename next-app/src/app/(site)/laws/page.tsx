import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { loadSearchParams } from "@/components/search-params";
import { lawsTitle } from "@/constants/page-title/laws";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { DataTableTransitionWrapper } from "@/features/laws/components/tables/data-table-transition-wrapper";
import { getLaws } from "@/features/laws/data/get-laws";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Metadata } from "next";
import { headers } from "next/headers";
import { SearchParams } from "nuqs/server";

interface Props {
  searchParams: Promise<SearchParams>;
}

export const metadata: Metadata = {
  title: lawsTitle.label.plural,
};

const LawsPage = async ({ searchParams }: Props) => {
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

  const laws = await getLaws({
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

  const selectedLaws = await getLaws({
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
            href: lawsTitle.href,
            label: capitalizeFirstLetter(lawsTitle.label.plural),
          },
        ])}
      />

      <PageTitle
        label={lawsTitle.label.plural}
        addBtnHref={`${lawsTitle.href}/add`}
        session={session}
      />

      <DataTableTransitionWrapper
        data={laws?.data || []}
        dataCount={laws?.count || 0}
        dataSelected={selectedLaws?.data || []}
      />

      {/* <div>
        <pre>{JSON.stringify({ laws }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default LawsPage;
