"use client";

import { CustomAvatar } from "@/components/custom-avatar";
import { CustomButton } from "@/components/custom-button";
import { ResourceIcon } from "@/components/icons/resource";
import { Badge } from "@/components/ui/badge";
import { resourcesTitle } from "@/constants/page-title/resources";
import { BuildingPassive } from "@/core/cog/building-passive/types/building-passive-duration";
import { SelectCell } from "@/core/table/components/select-column/cell";
import { SelectHeader } from "@/core/table/components/select-column/header";
import { THeadDropdown } from "@/core/table/components/thead-dropdown";
import { columnId } from "@/core/table/lib/utils/column-id";
import { dateFormatter } from "@/lib/utils/format-date";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { TransitionStartFunction } from "react";
import RowActions from "./row-actions";

export const columns = ({
  isLoading,
  startTransition,
  visibleUsers,
}: {
  isLoading: boolean;
  startTransition: TransitionStartFunction;
  visibleUsers: BuildingPassive[];
}): ColumnDef<BuildingPassive>[] => [
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
  // Resource
  {
    ...columnId({ id: "resource" }),
    meta: {
      label: "Resource",
    },
    accessorFn: (originalRow) => originalRow.resourceId?.toLowerCase(),
    enableHiding: false,
    enableSorting: true,
    enablePinning: true,
    // size: 110,
    // minSize: 105,
    // maxSize: 150,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="resource"
          label={"Resource"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => (
      <div className="flex items-center gap-1 px-3">
        {row.original.resource && (
          <>
            <Link href={`${resourcesTitle.href}/${row.original.resource.id}`}>
              <CustomAvatar
                image={row.original.resource.image}
                className="rounded-sm border-none"
                fit="contain"
                icon={<ResourceIcon />}
              />
            </Link>

            <CustomButton
              buttonLabel={String(row.original.resource.name)}
              size={"sm"}
              linkHref={`${resourcesTitle.href}/${row.original.resource.id}`}
              variant={"link"}
              className=""
              skeletonClassName="h-8 w-[121px]"
              noEffect
            />
          </>
        )}
      </div>
    ),
  },
  // Quantity
  {
    ...columnId({ id: "quantity" }),
    meta: {
      label: "Quantity",
    },
    accessorFn: (originalRow) => originalRow.quantity,
    enableHiding: false,
    enableSorting: true,
    enablePinning: true,
    // size: 110,
    // minSize: 105,
    // maxSize: 150,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="quantity"
          label={"Quantity"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => (
      <div className="px-3">
        <Badge>{row.original.quantity}</Badge>
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
    // size: 170,
    // minSize: 170,
    // maxSize: 200,
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
        <div suppressHydrationWarning className="px-3">
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
      <div className="grid place-items-center px-3">
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
      const captainRole = row.original;

      return (
        <div className="grid place-items-center px-3">
          <RowActions buildingPassive={captainRole} />
        </div>
      );
    },
  },
];
