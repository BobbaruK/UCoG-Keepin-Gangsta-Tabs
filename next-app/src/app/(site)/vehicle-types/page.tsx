import { PageStructure } from "@/components/page-structure";
import { PageTitle } from "@/components/page-title";
import { loadSearchParams } from "@/components/search-params";
import { vehicleTypesTitle } from "@/constants/page-title/vehicle-types";
import { PageBreadcrumbs } from "@/core/breadcrumb/components/page-breadcrumbs";
import { breadCrumbsFn } from "@/core/breadcrumb/lib/breadcrumbs";
import { DataTableTransitionWrapper } from "@/features/vehicle-types/components/tables/data-table-transition-wrapper";
import { getVehicleTypes } from "@/features/vehicle-types/data/get-vehicle-types";
import { auth } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Metadata } from "next";
import { headers } from "next/headers";
import { SearchParams } from "nuqs/server";

interface Props {
  searchParams: Promise<SearchParams>;
}

export const metadata: Metadata = {
  title: vehicleTypesTitle.label.plural,
};

const VehicleTypesPage = async ({ searchParams }: Props) => {
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

  const vehicleTypes = await getVehicleTypes({
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

  const selectedVehicleTypes = await getVehicleTypes({
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
            href: vehicleTypesTitle.href,
            label: capitalizeFirstLetter(vehicleTypesTitle.label.plural),
          },
        ])}
      />
      <PageTitle
        label={vehicleTypesTitle.label.plural}
        addBtnHref={`${vehicleTypesTitle.href}/add`}
        session={session}
      />

      <DataTableTransitionWrapper
        data={vehicleTypes?.data || []}
        dataCount={vehicleTypes?.count || 0}
        dataSelected={selectedVehicleTypes?.data || []}
      />

      {/* <div>
        <pre>{JSON.stringify({ vehicleTypes }, null, 2)}</pre>
      </div> */}
    </PageStructure>
  );
};

export default VehicleTypesPage;
