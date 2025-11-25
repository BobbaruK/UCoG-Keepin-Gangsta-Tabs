import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { loadSearchParams } from "@/components/search-params";
import { captainRolesTitle } from "@/constants/page-title/captain-roles";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { DataTableTransitionWrapper } from "@/features/captain-roles/components/tables/data-table-transition-wrapper";
import { getCaptainRoles } from "@/features/captain-roles/data/get";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Metadata } from "next";
import { headers } from "next/headers";
import { SearchParams } from "nuqs/server";

interface Props {
  searchParams: Promise<SearchParams>;
}

export const metadata: Metadata = {
  title: capitalizeFirstLetter(captainRolesTitle.label.plural.toLowerCase()),
};

const CaptainRolesPage = async ({ searchParams }: Props) => {
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

  const captainRoles = await getCaptainRoles({
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

  const selectedCaptainRoles = await getCaptainRoles({
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
            href: captainRolesTitle.href,
            label: capitalizeFirstLetter(captainRolesTitle.label.plural),
          },
        ])}
      />

      <PageTitle
        label={captainRolesTitle.label.plural}
        addBtnHref={`${captainRolesTitle.href}/add`}
        session={session}
      />

      <DataTableTransitionWrapper
        data={captainRoles?.data || []}
        dataCount={captainRoles?.count || 0}
        dataSelected={selectedCaptainRoles?.data || []}
      />

      {/* <div>
        <pre>{JSON.stringify({ captainRoles }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default CaptainRolesPage;
