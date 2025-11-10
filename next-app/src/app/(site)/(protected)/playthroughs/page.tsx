import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { loadSearchParams } from "@/components/search-params";
import { playthroughTitle } from "@/constants/page-title/playtrough";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { DataTableTransitionWrapper } from "@/features/playtroughs/components/tables/data-table-transition-wrapper";
import { getPlaythroughs } from "@/features/playtroughs/data/get";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Metadata } from "next";
import { headers } from "next/headers";
import { SearchParams } from "nuqs/server";

interface Props {
  searchParams: Promise<SearchParams>;
}

export const metadata: Metadata = {
  title: playthroughTitle.label.plural,
};

const PlaythroughsPage = async ({ searchParams }: Props) => {
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

  const playthroughs = await getPlaythroughs({
    pageNumber: pageIndex,
    perPage: pageSize,
    orderBy: { [sortBy]: sort },
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },

      auth_userId: {
        equals: session?.user.id,
      },
    },
  });

  const selectedPlaythroughs = await getPlaythroughs({
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
            href: playthroughTitle.href,
            label: capitalizeFirstLetter(playthroughTitle.label.plural),
          },
        ])}
      />
      <PageTitle
        label={playthroughTitle.label.plural}
        addBtnHref={`${playthroughTitle.href}/add`}
        forceAddButton
        session={session}
      />

      <DataTableTransitionWrapper
        data={playthroughs?.data || []}
        dataCount={playthroughs?.count || 0}
        dataSelected={selectedPlaythroughs?.data || []}
      />

      {/* <div>
        <pre>{JSON.stringify({ playthroughs }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default PlaythroughsPage;
