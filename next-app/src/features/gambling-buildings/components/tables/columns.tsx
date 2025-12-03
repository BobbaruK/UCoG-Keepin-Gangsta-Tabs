"use client";

import { CustomButton } from "@/components/custom-button";
import { Badge } from "@/components/ui/badge";
import { crewMembersTitle } from "@/constants/page-title/crew-members";
import { gamblingBuildingsTitle } from "@/constants/page-title/gambling-buildings";
import { gamblingFeatureTitle } from "@/constants/page-title/gambling-feature";
import { gamblingSizeTitle } from "@/constants/page-title/gambling-size";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { GamblingBuilding } from "@/core/cog/gambling-building/types/gambling-building";
import { gamblingFeatureColors } from "@/core/cog/gambling-feature/utils/gambling-feature-colors";
import { SelectCell } from "@/core/table/components/select-column/cell";
import { SelectHeader } from "@/core/table/components/select-column/header";
import { THeadDropdown } from "@/core/table/components/thead-dropdown";
import { columnId } from "@/core/table/lib/utils/column-id";
import { cn } from "@/lib/utils";
import { dateFormatter } from "@/lib/utils/format-date";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { TransitionStartFunction } from "react";
import CashOnHand from "./cash-on-hand";
import RowActions from "./row-actions";
import WeeklyCost from "./weekly-cost";

export const columns = ({
  isLoading,
  startTransition,
  visibleUsers,
}: {
  isLoading: boolean;
  startTransition: TransitionStartFunction;
  visibleUsers: GamblingBuilding[];
}): ColumnDef<GamblingBuilding>[] => [
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
  // Corner
  {
    ...columnId({ id: "corner" }),
    meta: {
      label: "Corner",
    },
    accessorFn: (originalRow) => originalRow.name.toLowerCase(),
    enableHiding: false,
    enableSorting: true,
    enablePinning: true,
    size: 200,
    minSize: 200,
    maxSize: 200,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="corner"
          label={"Corner"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => (
      <CustomButton
        buttonLabel={row.original.name}
        linkHref={`${playthroughTitle.href}/${row.original.playthrough_id + gamblingBuildingsTitle.href}/${row.original.id}`}
        size={"sm"}
        variant={"link"}
        skeletonClassName="h-9 w-[121px]"
        noEffect
      />
    ),
  },
  // Manager
  {
    ...columnId({ id: "manager" }),
    meta: {
      label: "Manager",
    },
    accessorFn: (originalRow) => originalRow.manager.full_name.toLowerCase(),
    enableHiding: false,
    enableSorting: true,
    enablePinning: true,
    size: 210,
    minSize: 210,
    maxSize: 210,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="manager"
          label={"Manager"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => (
      <CustomButton
        buttonLabel={row.original.manager.full_name}
        linkHref={`${playthroughTitle.href}/${row.original.playthrough_id + crewMembersTitle.href}/${row.original.manager_id}`}
        size={"sm"}
        variant={"link"}
        skeletonClassName="h-9 w-[121px]"
        noEffect
      />
    ),
  },
  // Building size
  {
    ...columnId({ id: "building_size" }),
    meta: {
      label: "Building size",
    },
    accessorFn: (originalRow) =>
      originalRow.gambling_building_size.max_features,
    enableHiding: true,
    enableSorting: true,
    enablePinning: true,
    size: 210,
    minSize: 210,
    maxSize: 210,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="building_size"
          label={"Building size"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => (
      <CustomButton
        buttonLabel={row.original.gambling_building_size.name}
        linkHref={`${gamblingSizeTitle.href}/${row.original.gambling_building_size_id}`}
        size={"sm"}
        variant={"link"}
        skeletonClassName="h-9 w-[121px]"
        noEffect
      />
    ),
  },
  // Gambling features
  {
    ...columnId({ id: "gambling_features" }),
    meta: {
      label: "Gambling features",
    },
    // accessorFn: (originalRow) =>
    //   originalRow.gambling_building_size.max_features,
    enableHiding: true,
    enableSorting: false,
    enablePinning: true,
    size: 320,
    minSize: 320,
    maxSize: 320,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="gambling_features"
          label={"Gambling features"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => (
      <div className="flex w-[300px] flex-wrap gap-2 px-2">
        {row.original.features.map((feature) => (
          <Badge asChild key={feature.id}>
            <Link
              href={`${gamblingFeatureTitle.href}/${feature.id}`}
              className={cn(
                gamblingFeatureColors({
                  type: feature.type,
                }),
              )}
            >
              {feature.name}
            </Link>
          </Badge>

          // <CustomButton
          //   key={feature.id}
          //   buttonLabel={feature.name}
          //   linkHref={`${gamblingFeatureTitle.href}/${feature.id}`}
          //   size={"sm"}
          //   variant={"link"}
          //   skeletonClassName="h-9 w-[121px]"
          //   noEffect
          // />
        ))}
      </div>
    ),
  },
  // Weekly cost
  {
    ...columnId({ id: "weekly" }),
    meta: {
      label: "Weekly cost",
    },
    // accessorFn: (originalRow) => originalRow.name.toLowerCase(),
    enableHiding: true,
    enableSorting: false,
    enablePinning: true,
    size: 140,
    minSize: 140,
    maxSize: 140,
    header: ({ column }) => {
      return (
        <div className="grid place-items-center">
          <THeadDropdown
            id="weekly"
            label={"Weekly cost"}
            isLoading={isLoading}
            startTransition={startTransition}
            column={column}
          />
        </div>
      );
    },

    cell: ({ row }) => {
      return (
        <div className="grid place-items-center px-2.5">
          <WeeklyCost gamblingBuilding={row.original} />
        </div>
      );
    },
  },
  // Cash on hand
  {
    ...columnId({ id: "cash" }),
    meta: {
      label: "Cash on hand",
    },
    // accessorFn: (originalRow) => originalRow.name.toLowerCase(),
    enableHiding: true,
    enableSorting: false,
    enablePinning: true,
    size: 150,
    minSize: 150,
    maxSize: 150,
    header: ({ column }) => {
      return (
        <div className="grid place-items-center">
          <THeadDropdown
            id="cash"
            label={"Cash on hand"}
            isLoading={isLoading}
            startTransition={startTransition}
            column={column}
          />
        </div>
      );
    },

    cell: ({ row }) => {
      return (
        <div className="grid place-items-center px-2.5">
          <CashOnHand gamblingBuilding={row.original} />
        </div>
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
    size: 110,
    minSize: 110,
    maxSize: 110,
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
    cell: ({ row }) => (
      <div className="grid place-items-center p-2">
        <RowActions gamblingBuilding={row.original} />
      </div>
    ),
  },
];
