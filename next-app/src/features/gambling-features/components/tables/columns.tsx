"use client";

import { CustomButton } from "@/components/custom-button";
import { Badge } from "@/components/ui/badge";
import { gamblingFeatureTitle } from "@/constants/page-title/gambling-feature";
import { GamblingFeature } from "@/core/cog/gambling-feature/types/gambling-feature";
import { gamblingFeatureColors } from "@/core/cog/gambling-feature/utils/gambling-feature-colors";
import { SelectCell } from "@/core/table/components/select-column/cell";
import { SelectHeader } from "@/core/table/components/select-column/header";
import { THeadDropdown } from "@/core/table/components/thead-dropdown";
import { columnId } from "@/core/table/lib/utils/column-id";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/format-currency";
import { dateFormatter } from "@/lib/utils/format-date";
import { ColumnDef } from "@tanstack/react-table";
import { TransitionStartFunction } from "react";
import RowActions from "./row-actions";

export const columns = ({
  isLoading,
  startTransition,
  visibleUsers,
}: {
  isLoading: boolean;
  startTransition: TransitionStartFunction;
  visibleUsers: GamblingFeature[];
}): ColumnDef<GamblingFeature>[] => [
  // Select
  {
    ...columnId({ id: "select" }),
    meta: {
      label: "Select",
    },
    enableHiding: false,
    enableSorting: false,
    enablePinning: true,
    size: 50,
    minSize: 48,
    maxSize: 60,
    header: ({}) => {
      return (
        <SelectHeader
          data={visibleUsers}
          isLoading={isLoading}
          startTransition={startTransition}
        />
      );
    },
    cell: ({ row }) => {
      const originalRow = row.original;
      const id = originalRow.id;

      return (
        <SelectCell
          id={id}
          isLoading={isLoading}
          startTransition={startTransition}
        />
      );
    },
  },
  // Name
  {
    ...columnId({ id: "name" }),
    meta: {
      label: "Name",
    },
    accessorFn: (originalRow) => originalRow.name.toLowerCase(),
    enableHiding: false,
    enableSorting: true,
    enablePinning: true,
    // size: 110,
    // minSize: 105,
    // maxSize: 150,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="name"
          label={"Name"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <CustomButton
          buttonLabel={row.original.name}
          size={"sm"}
          linkHref={`${gamblingFeatureTitle.href}/${row.original.id}`}
          variant={"link"}
          className=""
          skeletonClassName="h-9 w-[204px]"
          noEffect
        />
      </div>
    ),
  },
  // Type
  {
    ...columnId({ id: "type" }),
    meta: {
      label: "Type",
    },
    accessorFn: (originalRow) => originalRow.type.toLowerCase(),
    enableHiding: false,
    enableSorting: true,
    enablePinning: true,
    // size: 110,
    // minSize: 105,
    // maxSize: 150,
    header: ({ column }) => {
      return (
        <div className="grid place-items-center">
          <THeadDropdown
            id="type"
            label={"Type"}
            isLoading={isLoading}
            startTransition={startTransition}
            column={column}
          />
        </div>
      );
    },

    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-2 px-3">
        <span
          className={cn(
            "size-3 rounded-full",
            gamblingFeatureColors({ type: row.original.type, noHover: true }),
          )}
        />
      </div>
    ),
  },
  // Weekly cost
  {
    ...columnId({ id: "weekly_cost" }),
    meta: {
      label: "Weekly cost",
    },
    accessorFn: (originalRow) => originalRow.weekly_cost,
    enableHiding: false,
    enableSorting: true,
    enablePinning: true,
    // size: 110,
    // minSize: 105,
    // maxSize: 150,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="weekly_cost"
          label={"Weekly cost"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => (
      <div className="flex items-center gap-2 px-3">
        {row.original.weekly_cost > 0
          ? formatCurrency({
              value: row.original.weekly_cost,
            })
          : "None"}
      </div>
    ),
  },
  // Cash on hand
  {
    ...columnId({ id: "cash_on_hand" }),
    meta: {
      label: "Cash on hand",
    },
    accessorFn: (originalRow) => originalRow.cash_on_hand,
    enableHiding: false,
    enableSorting: true,
    enablePinning: true,
    // size: 110,
    // minSize: 105,
    // maxSize: 150,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="cash_on_hand"
          label={"Cash on hand"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => (
      <div className="flex items-center gap-2 px-3">
        {row.original.cash_on_hand > 0
          ? formatCurrency({
              value: row.original.cash_on_hand,
            })
          : "None"}
      </div>
    ),
  },
  // Is DLC
  {
    ...columnId({ id: "is_dlc" }),
    meta: {
      label: "Is DLC",
    },
    accessorFn: (originalRow) => originalRow.is_dlc,
    enableHiding: false,
    enableSorting: true,
    enablePinning: true,
    // size: 110,
    // minSize: 105,
    // maxSize: 150,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="is_dlc"
          label={"Is Atlantic City DLC"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => (
      <div className="flex items-center gap-2 px-3">
        <Badge variant={row.original.is_dlc ? "success" : "outline"}>
          {row.original.is_dlc ? "Yes" : "No"}
        </Badge>
      </div>
    ),
  },
  // Created At
  {
    ...columnId({ id: "createdAt" }),
    meta: {
      label: "Created at",
    },
    accessorFn: (originalRow) => originalRow.createdAt,
    sortingFn: "datetime",
    enableHiding: true,
    enableSorting: true,
    enablePinning: true,
    size: 185,
    minSize: 185,
    maxSize: 185,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="createdAt"
          label={"Created At"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },
    cell: ({ getValue }) => {
      const date = getValue() as Date | null;

      return (
        <div suppressHydrationWarning className="px-2.5">
          {date
            ? dateFormatter({
                date,
                options: {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                },
              })
            : "-"}
        </div>
      );
    },
  },
  // Actions
  {
    ...columnId({ id: "actions" }),
    meta: {
      label: "Actions",
    },
    enableHiding: false,
    enableSorting: false,
    size: 90,
    minSize: 75,
    maxSize: 100,
    header: ({ column }) => (
      <div className="grid place-items-center px-2.5">
        <THeadDropdown
          id="actions"
          label={"Actions"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      </div>
    ),
    enablePinning: true,
    cell: ({ row }) => {
      const law = row.original;

      return (
        <div className="grid place-items-center p-2">
          <RowActions gamblingFeature={law} />
        </div>
      );
    },
  },
];
