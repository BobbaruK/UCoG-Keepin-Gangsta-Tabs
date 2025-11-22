"use client";

import { CustomButton } from "@/components/custom-button";
import { Badge } from "@/components/ui/badge";
import { lawsTitle } from "@/constants/page-title/laws";
import { sideEffectsTitle } from "@/constants/page-title/side-effects";
import { Law } from "@/core/db/law/types/law";
import { SelectCell } from "@/core/table/components/select-column/cell";
import { SelectHeader } from "@/core/table/components/select-column/header";
import { THeadDropdown } from "@/core/table/components/thead-dropdown";
import { columnId } from "@/core/table/lib/utils/column-id";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
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
  visibleUsers: Law[];
}): ColumnDef<Law>[] => [
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
          linkHref={`${lawsTitle.href}/${row.original.id}`}
          variant={"link"}
          className=""
          skeletonClassName="h-9 w-[213px]"
          noEffect
        />
      </div>
    ),
  },
  // Side effect
  {
    ...columnId({ id: "sideEffect" }),
    meta: {
      label: "Side Effect",
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
          id="sideEffect"
          label={"Side Effect"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => (
      <div className="px-2">
        {row.original.sideEffect ? (
          <Badge
            asChild
            variant={
              row.original.sideEffect.value &&
              Math.sign(row.original.sideEffect.value) === 1
                ? "success"
                : "danger"
            }
          >
            <Link
              className="flex h-auto items-center justify-start gap-2 p-0 hover:cursor-pointer"
              href={`${sideEffectsTitle.href}/${row.original.sideEffect.id}`}
            >
              {row.original.sideEffect.name}
            </Link>
          </Badge>
        ) : (
          "None"
        )}
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
      const law = row.original;
      const type = law.type;

      return <div className="px-2">{capitalizeFirstLetter(type)}</div>;
    },
  },
  // Enact
  {
    ...columnId({ id: "enact" }),
    meta: {
      label: "Enact",
    },
    accessorFn: (originalRow) => originalRow.enact,
    enableHiding: true,
    enableSorting: true,
    enablePinning: true,
    // size: 110,
    // minSize: 105,
    // maxSize: 150,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="enact"
          label={"Enact"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },
    cell: ({ row }) => (
      <div className="px-2">{row.original.enact || "N/A"} </div>
    ),
  },
  // Revoke
  {
    ...columnId({ id: "revoke" }),
    meta: {
      label: "Revoke",
    },
    accessorFn: (originalRow) => originalRow.revoke,
    enableHiding: true,
    enableSorting: true,
    enablePinning: true,
    // size: 110,
    // minSize: 105,
    // maxSize: 150,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="revoke"
          label={"Revoke"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },
    cell: ({ row }) => (
      <div className="px-2">{row.original.revoke || "N/A"} </div>
    ),
  },
  // Description
  {
    ...columnId({ id: "description" }),
    meta: {
      label: "Description",
    },
    accessorFn: (originalRow) => originalRow.description?.toLowerCase(),
    enableHiding: true,
    enableSorting: false,
    enablePinning: false,
    // size: 110,
    // minSize: 105,
    // maxSize: 150,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="description"
          label={"Description"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => (
      <pre className="line-clamp-2 max-w-full whitespace-break-spaces">
        {row.original.description || "-"}
      </pre>
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
          <RowActions law={law} />
        </div>
      );
    },
  },
];
