import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { loadSearchParams } from "@/components/search-params";
import { sideEffectsTitle } from "@/constants/page-title/side-effects";
import { DataTableTransitionWrapper } from "@/features/side-effects/components/tables/data-table-transition-wrapper";
import { getSideEffects } from "@/features/side-effects/data/get-side-effects";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { headers } from "next/headers";
import { SearchParams } from "nuqs/server";

interface Props {
  searchParams: Promise<SearchParams>;
}

export const metadata: Metadata = {
  title: "Side Effects",
};

const SideEffectsPage = async ({ searchParams }: Props) => {
  const {
    // pagination
    pageIndex,
    pageSize,
    // sorting
    sortBy,
    sort,
    // filtering
    search,
    searchBy,
    // Select
    selected,
  } = await loadSearchParams(searchParams);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const sideEffects = await getSideEffects({
    pageNumber: pageIndex,
    perPage: pageSize,
    orderBy: {
      [sortBy]: sort,
    },
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
  });

  const selectedSideEffects = await getSideEffects({
    where: {
      id: {
        in: selected || [],
      },
    },
    perPage: -1,
  });

  return (
    <PageStructure>
      <PageTitle
        label={sideEffectsTitle.label.plural}
        addBtnHref={`${sideEffectsTitle.href}/add`}
        session={session}
      />

      <DataTableTransitionWrapper
        data={sideEffects?.data || []}
        dataCount={sideEffects?.count || 0}
        dataSelected={selectedSideEffects?.data || []}
      />

      {/* <div>
        <pre>{JSON.stringify({ sideEffects }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default SideEffectsPage;
