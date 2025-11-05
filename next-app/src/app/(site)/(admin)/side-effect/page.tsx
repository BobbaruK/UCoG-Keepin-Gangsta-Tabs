import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { loadSearchParams } from "@/components/search-params";
import { DataTableTransitionWrapper } from "@/core/admin/side-effects/components/tables/data-table-transition-wrapper";
import { getSideEffects } from "@/core/admin/side-effects/data/get-side-effects";
import { UserRole } from "@/generated/prisma";
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

const UsersPage = async ({ searchParams }: Props) => {
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
        label={"Side effects"}
        addBtnHref="/side-effect/add"
        role={session?.user.role as UserRole}
      />

      <DataTableTransitionWrapper
        data={sideEffects?.data || []}
        dataCount={sideEffects?.count || 0}
        dataSelected={selectedSideEffects?.data || []}
      />

      <div>
        <pre>{JSON.stringify({ sideEffects }, null, 2)}</pre>
      </div>
    </PageStructure>
  );
};

export default UsersPage;
