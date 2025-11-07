import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { loadSearchParams } from "@/components/search-params";
import { sideEffectsTitle } from "@/constants/page-title/side-effects";
import { usersTitle } from "@/constants/page-title/users";
import { DataTableTransitionWrapper } from "@/core/admin/users/components/tables/data-table-transition-wrapper";
import {
  getUsersBAuth,
  getUsersPrisma,
} from "@/core/admin/users/data/get-users";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { IBreadcrumb } from "@/core/breadcrumb/types/breadcrumb";
import { UserSession } from "@/types/session";
import { capitalizeFirstLetter } from "better-auth";
import { Metadata } from "next";
import { SearchParams } from "nuqs/server";

const BREADCRUMBS: IBreadcrumb[] = [
  {
    label: "Admin",
  },
  {
    href: usersTitle.href,
    label: capitalizeFirstLetter(usersTitle.label.plural),
  },
];

export const metadata: Metadata = {
  title: "Users",
};

interface Props {
  searchParams: Promise<SearchParams>;
}

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

  const usersData = await getUsersBAuth({
    // pagination
    pageNumber: pageIndex,
    perPage: pageSize,
    // sorting
    sortBy,
    sortDirection: sort || undefined,
    // filtering
    searchValue: search,
    searchField: searchBy,
  });

  if (!usersData) {
    return (
      <PageStructure>
        <h1 className="text-3xl font-bold">No data!</h1>
        <p>No users returned</p>
      </PageStructure>
    );
  }

  const users = usersData.data as UserSession[];

  const totalUsers = usersData.total || 0;

  const usersSelected = await getUsersPrisma({
    where: {
      id: {
        in: selected || [],
      },
    },
    perPage: -1,
  });

  return (
    <PageStructure>
      <PageBreadcrumbs crumbs={breadCrumbsFn(BREADCRUMBS)} />
      <PageTitle
        label={usersTitle.label.plural}
        addBtnHref={`${usersTitle.href}/add`}
      />

      <DataTableTransitionWrapper
        data={users}
        dataCount={totalUsers}
        dataSelected={usersSelected || []}
      />

      {/*
      <div>
        <pre>{JSON.stringify(usersData, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default UsersPage;
