"use client";

import { BuildingSize } from "@/core/cog/building-size/types/building-size";
import { DataTable } from "@/core/table/components/data-table";
import TableProvider from "@/core/table/providers/table-provider";
import { useTransition } from "react";
import { columns } from "./columns";
import PaginationActions from "./pagination-actions";

interface Props {
  data: BuildingSize[];
  dataCount: number | null;
  dataSelected?: BuildingSize[];
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
