"use client";

import { GamblingBuilding } from "@/core/cog/gambling-building/types/gambling-building";
import Legend from "@/core/cog/gambling-feature/components/legend";
import { DataTable } from "@/core/table/components/data-table";
import TableProvider from "@/core/table/providers/table-provider";
import { useTransition } from "react";
import { columns } from "./columns";
import PaginationActions from "./pagination-actions";

interface Props {
  data: GamblingBuilding[];
  dataCount: number | null;
  dataSelected?: GamblingBuilding[];
  respectForTheLaw?: boolean;
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
        columnVisibilityObj={{
          description: true,
          createdAt: false,
        }}
        columnPinning={{
          left: ["select"],
          right: ["actions", "weekly", "cash"],
        }}
        twSkeletonHeightCell="h-[64.5px]"
        legendItems={<Legend />}
        legendFooter="and"
      />
    </TableProvider>
  );
};
