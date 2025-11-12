"use client";

import { CustomAvatar } from "@/components/custom-avatar";
import { Badge } from "@/components/ui/badge";
import { captainRolesTitle } from "@/constants/page-title/captain-roles";
import { sideEffectsTitle } from "@/constants/page-title/side-effects";
import { SelectCell } from "@/core/table/components/select-column/cell";
import { SelectHeader } from "@/core/table/components/select-column/header";
import { THeadDropdown } from "@/core/table/components/thead-dropdown";
import { columnId } from "@/core/table/lib/utils/column-id";
import { dateFormatter } from "@/lib/utils/format-date";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { TransitionStartFunction } from "react";
import { CaptainRole } from "../../types/roles";
import RowActions from "./row-actions";

export const columns = ({
  isLoading,
  startTransition,
  visibleUsers,
}: {
  isLoading: boolean;
  startTransition: TransitionStartFunction;
  visibleUsers: CaptainRole[];
}): ColumnDef<CaptainRole>[] => [
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
            href={`${captainRolesTitle.href}/${id}`}
          >
            {image && (
              <CustomAvatar
                image={image}
                fit="contain"
                className="rounded-md border-none"
              />
            )}
            {name}
          </Link>
        </div>
      );
    },
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

    cell: ({ row }) => {
      const trait = row.original;
      const sideEffect = trait.sideEffect;
      const sideEffectName = sideEffect?.name;
      const sideEffectId = sideEffect?.id;
      const sideEffectValue = sideEffect?.value;

      return sideEffect ? (
        <Badge
          asChild
          variant={
            sideEffectValue && Math.sign(sideEffectValue) === 1
              ? "success"
              : "danger"
          }
        >
          <Link
            className="flex h-auto items-center justify-start gap-2 p-0 hover:cursor-pointer"
            href={`${sideEffectsTitle.href}/${sideEffectId}`}
          >
            {sideEffectName}
          </Link>
        </Badge>
      ) : (
        "-"
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
      const captainRole = row.original;

      return (
        <div className="grid place-items-center p-2">
          <RowActions captainRole={captainRole} />
        </div>
      );
    },
  },
];
