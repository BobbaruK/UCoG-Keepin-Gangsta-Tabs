"use client";

import { CustomAvatar } from "@/components/custom-avatar";
import { resourceTypesTitle } from "@/constants/page-title/resource-types";
import { resourcesTitle } from "@/constants/page-title/resources";
import { SelectCell } from "@/core/table/components/select-column/cell";
import { SelectHeader } from "@/core/table/components/select-column/header";
import { THeadDropdown } from "@/core/table/components/thead-dropdown";
import { columnId } from "@/core/table/lib/utils/column-id";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { formatCurrency } from "@/lib/utils/format-currency";
import { dateFormatter } from "@/lib/utils/format-date";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { TransitionStartFunction } from "react";
import { Resource } from "../../types/resource";
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
      const resourceType = row.original;
      const name = resourceType.name;
      const image = resourceType.image;
      const id = resourceType.id;

      return (
        <div className="flex items-center gap-2">
          <Link
            className="flex h-auto items-center justify-start gap-2 p-0 hover:cursor-pointer"
            href={`${resourcesTitle.href}/${id}`}
          >
            <CustomAvatar
              image={image}
              fit="contain"
              className="rounded-md border-none"
            />
            {name}
          </Link>
        </div>
      );
    },
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

    cell: ({ row }) => capitalizeFirstLetter(row.original.category),
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

    cell: ({ row }) => {
      const resource = row.original;
      const price = resource.price;

      return formatCurrency({
        value: price,
      });
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

    cell: ({ row }) => {
      const resource = row.original;
      const typeCapacity = resource.resource_type.capacity;

      return typeCapacity;
    },
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
        <Link href={`${resourceTypesTitle.href}/${typeId}`}>
          {capitalizeFirstLetter(type)}
        </Link>
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
        <div suppressHydrationWarning>
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
      <THeadDropdown
        id="actions"
        label={"Actions"}
        isLoading={isLoading}
        startTransition={startTransition}
        column={column}
      />
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
