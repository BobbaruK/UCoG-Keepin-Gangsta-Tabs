"use client";

import { DataTable } from "@/core/table/components/data-table";
import TableProvider from "@/core/table/providers/table-provider";
import { cog_side_effect } from "@/generated/prisma";
import { TableRowSelect } from "@/types/table-row-select";
import { useTransition } from "react";
import PaginationActions from "./pagination-actions";
import { sideEffectColumns } from "./side-effects-columns";

interface Props {
  data: cog_side_effect[];
  dataCount: number | null;
  dataSelected?: cog_side_effect[];
}

export const DataTableTransitionWrapper = ({
  data,
  dataCount,
  dataSelected,
}: Props) => {
  const [isLoading, startTransition] = useTransition();

  const selected: TableRowSelect = {
    type: "side-effects",
    data: dataSelected || null,
  };

  return (
    <TableProvider
      isLoading={isLoading}
      startTransition={startTransition}
      dataCount={dataCount || 0}
      dataSelected={selected}
      paginationActions={
        <PaginationActions
          dataSelected={selected}
          isLoading={isLoading}
          startTransition={startTransition}
        />
      }
    >
      <DataTable
        columns={sideEffectColumns({
          isLoading,
          startTransition,
          visibleUsers: data,
        })}
        data={data}
        columnVisibilityObj={{
          description: true,
          createdAt: true,
        }}
        columnPinning={
          {
            // left: ["select"],
            // right: ["actions"],
          }
        }
        twSkeletonHeightCell="h-[64px]"
      />
    </TableProvider>
  );
};
