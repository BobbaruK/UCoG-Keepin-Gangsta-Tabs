"use client";

import { DataTable } from "@/core/table/components/data-table";
import TableProvider from "@/core/table/providers/table-provider";
import { TableRowSelect } from "@/types/table-row-select";
import { useTransition } from "react";
import { VehicleType } from "../../types/vehicle-type";
import { columns } from "./columns";
import PaginationActions from "./pagination-actions";

interface Props {
  data: VehicleType[];
  dataCount: number | null;
  dataSelected?: VehicleType[];
}

export const DataTableTransitionWrapper = ({
  data,
  dataCount,
  dataSelected,
}: Props) => {
  const [isLoading, startTransition] = useTransition();

  const selected: TableRowSelect = {
    type: "vehicle-types",
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
