"use client";

import { Trait } from "@/core/cog/trait/types/trait";
import { DataTable } from "@/core/table/components/data-table";
import TableProvider from "@/core/table/providers/table-provider";
import { columns } from "@/features/traits/components/tables/columns";
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
          right: ["actions"],
        }}
        twSkeletonHeightCell="h-[64px]"
      />
    </TableProvider>
  );
};
