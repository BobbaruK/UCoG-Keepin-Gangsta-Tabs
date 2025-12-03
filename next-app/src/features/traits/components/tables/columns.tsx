"use client";

import { CustomAvatar } from "@/components/custom-avatar";
import { CustomButton } from "@/components/custom-button";
import { TraitsIcon } from "@/components/icons/traits";
import { Badge } from "@/components/ui/badge";
import { sideEffectsTitle } from "@/constants/page-title/side-effects";
import { traitsTitle } from "@/constants/page-title/traits";
import { Trait } from "@/core/cog/trait/types/trait";
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
  visibleUsers: Trait[];
}): ColumnDef<Trait>[] => [
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

    cell: ({ row }) => {
      const trait = row.original;
      const sideEffectId = trait.id;
      const image = trait.image;

      return (
        <div className="px-2.5">
          <Link
            className="flex h-auto items-center justify-start gap-2 p-0 hover:cursor-pointer"
            href={`${traitsTitle.href}/${sideEffectId}`}
          >
            <CustomAvatar
              image={image}
              icon={<TraitsIcon />}
              className="size-12 rounded-sm border-none"
              fit="contain"
            />
          </Link>
        </div>
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

    cell: ({ row }) => {
      const trait = row.original;
      const name = trait.name;
      const sideEffectId = trait.id;

      return (
        <CustomButton
          buttonLabel={name}
          linkHref={`${traitsTitle.href}/${sideEffectId}`}
          size={"sm"}
          variant={"link"}
          skeletonClassName="h-9 w-[121px]"
          noEffect
        />
      );
    },
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
    size: 110,
    minSize: 105,
    maxSize: 150,
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

      return (
        <div className="px-2.5">
          {sideEffect ? (
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
          )}
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
    size: 110,
    minSize: 105,
    maxSize: 150,
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
      const sideEffect = row.original;

      return (
        <div className="grid place-items-center px-2.5">
          <RowActions trait={sideEffect} />
        </div>
      );
    },
  },
];
