"use client";

import { AutoRouteType } from "@/core/cog/auto-route-type/types/auto-route-type";
import { DataTable } from "@/core/table/components/data-table";
import TableProvider from "@/core/table/providers/table-provider";
import { useTransition } from "react";
import { columns } from "./columns";
import PaginationActions from "./pagination-actions";

interface Props {
  data: AutoRouteType[];
  dataCount: number | null;
  dataSelected?: AutoRouteType[];
}

export const DataTableTransitionWrapper = ({
  data,
  dataCount,
  dataSelected,
}: Props) => {
  const [isLoading, startTransition] = useTransition();

  return (
    <TableProvider
      isLoading={isLoading}
      startTransition={startTransition}
      dataCount={dataCount || 0}
      dataSelected={dataSelected || []}
      paginationActions={<PaginationActions />}
    >
      <DataTable
        columns={columns({
          isLoading,
          startTransition,
          visibleUsers: data,
        })}
        data={data}
        columnVisibilityObj={
          {
            // createdAt: false,
          }
        }
        columnPinning={{
          left: ["select"],
          right: ["actions"],
        }}
        twSkeletonHeightCell="h-[49px]"
      />
    </TableProvider>
  );
};
