"use client";

import { userColumns } from "@/core/admin/users/components/tables/users-columns";
import { DataTable } from "@/core/table/components/data-table";
import TableProvider from "@/core/table/providers/table-provider";
import { UserSession } from "@/types/session";
import { useTransition } from "react";
import PaginationActions from "./pagination-actions";

interface Props {
  data: UserSession[];
  dataCount: number | null;
  dataSelected?: UserSession[];
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
      showSearchSwitch
    >
      <DataTable
        columns={userColumns({
          isLoading,
          startTransition,
          visibleUsers: data,
        })}
        data={data}
        columnVisibilityObj={{
          avatar: true,
          firstName: true,
          lastName: true,
          username: true,
          email: true,
          role: true,
          twoFactorEnabled: true,
          emailVerified: true,
          banned: true,
          banReason: true,
          banExpires: true,
          createdAt: true,
          lastLoginAt: true,
          lastLoginMethod: true,
          actions: true,
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
