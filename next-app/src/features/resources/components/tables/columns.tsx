"use client";

import { CustomAvatar } from "@/components/custom-avatar";
import { CustomButton } from "@/components/custom-button";
import { DrillIcon } from "@/components/icons/drill";
import { resourceTypesTitle } from "@/constants/page-title/resource-types";
import { resourcesTitle } from "@/constants/page-title/resources";
import { Resource } from "@/core/db/resource/types/resource";
import { SelectCell } from "@/core/table/components/select-column/cell";
import { SelectHeader } from "@/core/table/components/select-column/header";
import { THeadDropdown } from "@/core/table/components/thead-dropdown";
import { columnId } from "@/core/table/lib/utils/column-id";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { formatCurrency } from "@/lib/utils/format-currency";
import { dateFormatter } from "@/lib/utils/format-date";
import { ft3m3 } from "@/lib/utils/ft3-m3";
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
  visibleUsers: Resource[];
}): ColumnDef<Resource>[] => [
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
  // Icon
  {
    ...columnId({ id: "icon" }),
    meta: {
      label: "Icon",
    },
    accessorFn: (originalRow) => originalRow.name.toLowerCase(),
    enableHiding: true,
    enableSorting: false,
    enablePinning: true,
    size: 110,
    minSize: 105,
    maxSize: 150,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="icon"
          label={"Icon"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => (
      <div className="px-2">
        <Link
          className="flex h-auto items-center justify-start gap-2 p-0 hover:cursor-pointer"
          href={`${resourcesTitle.href}/${row.original.id}`}
        >
          <CustomAvatar
            image={row.original.image}
            className="size-12 rounded-sm border-none"
            fit="contain"
            icon={<DrillIcon />}
          />
        </Link>
      </div>
    ),
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
    size: 110,
    minSize: 105,
    maxSize: 150,
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
      <CustomButton
        buttonLabel={row.original.name}
        linkHref={`${resourcesTitle.href}/${row.original.id}`}
        size={"sm"}
        variant={"link"}
        skeletonClassName="h-9 w-[121px]"
        noEffect
      />
    ),
  },
  // Category
  {
    ...columnId({ id: "category" }),
    meta: {
      label: "Category",
    },
    accessorFn: (originalRow) => originalRow.category.toLowerCase(),
    enableHiding: true,
    enableSorting: false,
    enablePinning: true,
    // size: 110,
    // minSize: 105,
    // maxSize: 150,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="category"
          label={"Category"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => (
      <div className="px-2">{capitalizeFirstLetter(row.original.category)}</div>
    ),
  },
  // Price
  {
    ...columnId({ id: "price" }),
    meta: {
      label: "Price",
    },
    accessorFn: (originalRow) => originalRow.price,
    enableHiding: false,
    enableSorting: true,
    enablePinning: true,
    // size: 110,
    // minSize: 105,
    // maxSize: 150,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="price"
          label={"Price"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => (
      <div className="px-2">
        {formatCurrency({
          value: row.original.price,
        })}
      </div>
    ),
  },
  // Type
  {
    ...columnId({ id: "type" }),
    meta: {
      label: "Type",
    },
    accessorFn: (originalRow) => originalRow.resource_type.name,
    enableHiding: true,
    enableSorting: true,
    enablePinning: true,
    // size: 110,
    // minSize: 105,
    // maxSize: 150,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="type"
          label={"Type"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => {
      const resource = row.original;
      const type = resource.resource_type.name;
      const typeId = resource.resource_type.id;

      return (
        <CustomButton
          buttonLabel={capitalizeFirstLetter(type)}
          linkHref={`${resourceTypesTitle.href}/${typeId}`}
          size={"sm"}
          variant={"link"}
          skeletonClassName="h-9 w-[121px]"
          noEffect
        />
      );
    },
  },
  // Capacity
  {
    ...columnId({ id: "capacity" }),
    meta: {
      label: "Capacity",
    },
    accessorFn: (originalRow) => originalRow.resource_type.capacity,
    enableHiding: true,
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
    cell: ({ row }) => (
      <div
        className="px-2"
        dangerouslySetInnerHTML={{
          __html: ft3m3(row.original.resource_type.capacity).html,
        }}
      />
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
      <div className="grid place-items-center">
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
      const resource = row.original;

      return (
        <div className="grid place-items-center p-2">
          <RowActions resource={resource} />
        </div>
      );
    },
  },
];
