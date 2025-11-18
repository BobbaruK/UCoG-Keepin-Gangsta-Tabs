"use client";

import { CustomAvatar } from "@/components/custom-avatar";
import { Badge } from "@/components/ui/badge";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { Playthrough } from "@/core/db/playthrough/types/playthrough";
import { SelectCell } from "@/core/table/components/select-column/cell";
import { SelectHeader } from "@/core/table/components/select-column/header";
import { THeadDropdown } from "@/core/table/components/thead-dropdown";
import { columnId } from "@/core/table/lib/utils/column-id";
import { cn } from "@/lib/utils";
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
  visibleUsers: Playthrough[];
}): ColumnDef<Playthrough>[] => [
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
      const trait = row.original;
      const name = trait.name;
      const sideEffectId = trait.id;

      return (
        <div className="flex items-center gap-2 px-2">
          <Link
            className="flex h-auto items-center justify-start gap-2 p-0 hover:cursor-pointer"
            href={`${playthroughTitle.href}/${sideEffectId}`}
          >
            {name}
          </Link>
        </div>
      );
    },
  },
  // Seed
  {
    ...columnId({ id: "seed" }),
    meta: {
      label: "Seed",
    },
    accessorFn: (originalRow) => originalRow.seed,
    enableHiding: true,
    enableSorting: false,
    enablePinning: false,
    // size: 110,
    // minSize: 105,
    // maxSize: 150,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="seed"
          label={"Seed"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => {
      const seed = row.original.seed;

      return <div className="flex items-center gap-2">{seed || "-"}</div>;
    },
  },
  // Passenger Rail Station
  {
    ...columnId({ id: "passenger_rail_station" }),
    meta: {
      label: "Passenger Rail Station",
    },
    accessorFn: (originalRow) => originalRow.passenger_rail_station,
    enableHiding: true,
    enableSorting: false,
    enablePinning: false,
    // size: 110,
    // minSize: 105,
    // maxSize: 150,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="passenger_rail_station"
          label={"Passenger Rail Station"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => {
      const passengerRailStation = row.original.passenger_rail_station;

      return (
        <Badge variant={passengerRailStation ? "success" : "danger"}>
          {passengerRailStation ? "Yes" : "No"}
        </Badge>
      );
    },
  },
  // Freight Rail Station
  {
    ...columnId({ id: "freight_rail_station" }),
    meta: {
      label: "Freight Rail Station",
    },
    accessorFn: (originalRow) => originalRow.freight_rail_station,
    enableHiding: true,
    enableSorting: false,
    enablePinning: false,
    // size: 110,
    // minSize: 105,
    // maxSize: 150,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="freight_rail_station"
          label={"Freight Rail Station"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => {
      const freightRailStation = row.original.freight_rail_station;

      return (
        <Badge variant={freightRailStation ? "success" : "danger"}>
          {freightRailStation ? "Yes" : "No"}
        </Badge>
      );
    },
  },
  // Respect for the law
  {
    ...columnId({ id: "respectForTheLaw" }),
    meta: {
      label: "Respect for the law",
    },
    accessorFn: (originalRow) => originalRow.respect_for_the_law,
    enableHiding: true,
    enableSorting: false,
    enablePinning: false,
    // size: 110,
    // minSize: 105,
    // maxSize: 150,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="respectForTheLaw"
          label={"Respect for the law"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => {
      const respectForTheLaw = row.original.respect_for_the_law;

      return (
        <Badge variant={respectForTheLaw ? "success" : "danger"}>
          {respectForTheLaw ? "Yes" : "No"}
        </Badge>
      );
    },
  },
  // Laws
  {
    ...columnId({ id: "laws" }),
    meta: {
      label: "Laws",
    },
    accessorFn: (originalRow) => originalRow.laws.length,
    enableHiding: true,
    enableSorting: false,
    enablePinning: false,
    // size: 110,
    // minSize: 105,
    // maxSize: 150,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="laws"
          label={"Laws"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => {
      const laws = row.original.laws;

      return (
        <div className="flex items-center gap-2">
          {laws[0] ? laws[0].name : "-"}
          {laws.length > 1 && (
            <Badge variant={"outline"}>+{laws.length - 1}</Badge>
          )}
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
      const playthrough = row.original;

      return (
        <div className="grid place-items-center p-2">
          <RowActions playthrough={playthrough} />
        </div>
      );
    },
  },
];
