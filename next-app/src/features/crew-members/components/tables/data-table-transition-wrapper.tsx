"use client";

import { CrewMember } from "@/core/cog/crew-member/types/crew-member";
import { DataTable } from "@/core/table/components/data-table";
import TableProvider from "@/core/table/providers/table-provider";
import { useTransition } from "react";
import { columns } from "./columns";
import PaginationActions from "./pagination-actions";

interface Props {
  data: CrewMember[];
  dataCount: number | null;
  dataSelected?: CrewMember[];
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
          right: ["actions", "mp", "ap"],
        }}
        twSkeletonHeightCell="h-[117.5px]"
      />
    </TableProvider>
  );
};
