"use client";

import { vehicleTypesTitle } from "@/constants/page-title/vehicle-types";
import { VehicleType } from "@/core/cog/vehicle-type/types/vehicle-type";
import { SelectCell } from "@/core/table/components/select-column/cell";
import { SelectHeader } from "@/core/table/components/select-column/header";
import { THeadDropdown } from "@/core/table/components/thead-dropdown";
import { columnId } from "@/core/table/lib/utils/column-id";
import { dateFormatter } from "@/lib/utils/format-date";
import { ft3m3 } from "@/lib/utils/ft3-m3";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { TransitionStartFunction } from "react";
import RowActions from "./row-actions";
import { CustomButton } from "@/components/custom-button";
import { TrashIcon } from "@/components/icons/trash";

export const columns = ({
  isLoading,
  startTransition,
  visibleUsers,
}: {
  isLoading: boolean;
  startTransition: TransitionStartFunction;
  visibleUsers: VehicleType[];
}): ColumnDef<VehicleType>[] => [
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

    cell: ({ row }) => {
      const vehicleType = row.original;
      const name = vehicleType.name;
      const id = vehicleType.id;

      return (
        <div className="">
          <CustomButton
            buttonLabel={name}
            size={"sm"}
            linkHref={`${vehicleTypesTitle.href}/${id}`}
            variant={"link"}
            className=""
            skeletonClassName="h-9 w-[150px]"
            noEffect
          />
          {/* <Link href={`${vehicleTypesTitle.href}/${id}`}>{name}</Link> */}
        </div>
      );
    },
  },
  // Capacity
  {
    ...columnId({ id: "capacity" }),
    meta: {
      label: "Capacity",
    },
    accessorFn: (originalRow) => originalRow.capacity,
    enableHiding: false,
    enableSorting: true,
    enablePinning: true,
    // size: 110,
    // minSize: 105,
    // maxSize: 150,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="capacity"
          label={"Capacity"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => {
      const vehicleType = row.original;
      const capacity = vehicleType.capacity;

      return (
        <div
          dangerouslySetInnerHTML={{ __html: ft3m3(capacity).html }}
          className="px-2"
        />
      );
    },
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
        <div suppressHydrationWarning className="px-2">
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
      <div className="grid place-items-center px-2">
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
          <RowActions vehicleType={law} />
        </div>
      );
    },
  },
];
