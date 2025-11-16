"use client";

import { DataTable } from "@/core/table/components/data-table";
import TableProvider from "@/core/table/providers/table-provider";
import { useTransition } from "react";
import { CaptainRole } from "../../types/captain-role";
import { CrewMember } from "../../types/crew-member";
import { CrewLevel } from "../../types/level";
import { Nationality } from "../../types/nationality";
import { Trait } from "../../types/traits";
import { columns } from "./columns";
import PaginationActions from "./pagination-actions";

interface Props {
  data: CrewMember[];
  dataCount: number | null;
  dataSelected?: CrewMember[];
  roles: CaptainRole[] | undefined;
  nationalities: Nationality[] | undefined;
  traits: Trait[] | undefined;
  levels: CrewLevel[] | undefined;
}

export const DataTableTransitionWrapper = ({
  data,
  dataCount,
  dataSelected,
  roles,
  nationalities,
  traits,
  levels,
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
          roles,
          nationalities,
          traits,
          levels,
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
        twSkeletonHeightCell="h-[64px]"
      />
    </TableProvider>
  );
};
