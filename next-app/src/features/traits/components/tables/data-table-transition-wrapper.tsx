"use client";

import { DataTable } from "@/core/table/components/data-table";
import TableProvider from "@/core/table/providers/table-provider";
import { columns } from "@/features/traits/components/tables/columns";
import { Trait } from "@/features/traits/types/trait";
import { TableRowSelect } from "@/types/table-row-select";
import { useTransition } from "react";
import PaginationActions from "./pagination-actions";

interface Props {
  data: Trait[];
  dataCount: number | null;
  dataSelected?: Trait[];
}

export const DataTableTransitionWrapper = ({
  data,
  dataCount,
  dataSelected,
}: Props) => {
  const [isLoading, startTransition] = useTransition();

  const selected: TableRowSelect = {
    type: "traits",
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
          right: ["actions"],
        }}
        twSkeletonHeightCell="h-[64px]"
      />
    </TableProvider>
  );
};
