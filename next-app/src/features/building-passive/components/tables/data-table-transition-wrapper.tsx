"use client";

import { BuildingPassiveDuration } from "@/core/cog/building-passive-duration/types/building-passive-duration";
import { DataTable } from "@/core/table/components/data-table";
import TableProvider from "@/core/table/providers/table-provider";
import { useTransition } from "react";
import { columns } from "./columns";
import PaginationActions from "./pagination-actions";
import { BuildingPassive } from "@/core/cog/building-passive/types/building-passive-duration";

interface Props {
  data: BuildingPassive[];
  dataCount: number | null;
  dataSelected?: BuildingPassive[];
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
