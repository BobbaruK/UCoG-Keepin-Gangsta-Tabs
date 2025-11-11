"use client";

import { playthroughTitle } from "@/constants/page-title/playtrough";
import { SelectCell } from "@/core/table/components/select-column/cell";
import { SelectHeader } from "@/core/table/components/select-column/header";
import { THeadDropdown } from "@/core/table/components/thead-dropdown";
import { columnId } from "@/core/table/lib/utils/column-id";
import { dateFormatter, turnToDate } from "@/lib/utils/format-date";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { TransitionStartFunction } from "react";
import { PoliceOfficer } from "../../types/police-officer";
import RowActions from "./row-actions";
import { Badge } from "@/components/ui/badge";

export const columns = ({
  isLoading,
  startTransition,
  visibleUsers,
}: {
  isLoading: boolean;
  startTransition: TransitionStartFunction;
  visibleUsers: PoliceOfficer[];
}): ColumnDef<PoliceOfficer>[] => [
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
      const officer = row.original;
      const name = officer.name;

      return <div className="flex items-center gap-2">{name}</div>;
    },
  },
  // Bribed turn
  {
    ...columnId({ id: "bribedTurn" }),
    meta: {
      label: "Bribed turn",
    },
    accessorFn: (originalRow) => originalRow.bribed_turn,
    enableHiding: true,
    enableSorting: true,
    enablePinning: true,
    // size: 110,
    // minSize: 105,
    // maxSize: 150,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="bribedTurn"
          label={"Bribed turn"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => {
      const officer = row.original;
      const bribedTurn = officer.bribed_turn;

      return (
        <div className="flex items-center gap-2">
          <Badge variant={"outline"}>{bribedTurn}</Badge>
          {dateFormatter({
            date: turnToDate(bribedTurn),
            options: {
              year: "numeric",
              month: "long",
              day: "numeric",
            },
          })}
        </div>
      );
    },
  },
  // Bribe expires
  {
    ...columnId({ id: "bribeExpires" }),
    meta: {
      label: "Bribe expires",
    },
    accessorFn: (originalRow) => originalRow.bribed_turn,
    enableHiding: true,
    enableSorting: false,
    enablePinning: true,
    // size: 110,
    // minSize: 105,
    // maxSize: 150,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="bribeExpires"
          label={"Bribe expires"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => {
      const officer = row.original;
      const bribedTurn = officer.bribed_turn;
      const bribeExpires =
        bribedTurn + (officer.political_contact_used ? 52 : 35);

      return (
        <div className="flex items-center gap-2">
          <Badge variant={"outline"}>{bribeExpires}</Badge>
          {dateFormatter({
            date: turnToDate(bribeExpires),
            options: {
              year: "numeric",
              month: "long",
              day: "numeric",
            },
          })}
        </div>
      );
    },
  },
  // Can call in a raid?
  {
    ...columnId({ id: "callRaid" }),
    meta: {
      label: "Call raid?",
    },
    accessorFn: (originalRow) => originalRow.can_call_in_a_raid,
    enableHiding: true,
    enableSorting: true,
    enablePinning: true,
    // size: 110,
    // minSize: 105,
    // maxSize: 150,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="callRaid"
          label={"Can call in a raid?"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => {
      const officer = row.original;
      const canCallRaid = officer.can_call_in_a_raid;

      return (
        <Badge variant={canCallRaid ? "success" : "danger"}>
          {canCallRaid ? "Yes" : "No"}
        </Badge>
      );
    },
  },
  // Has a rival or hooligan relative?
  {
    ...columnId({ id: "rivalRelative" }),
    meta: {
      label: "Rival relative?",
    },
    accessorFn: (originalRow) => originalRow.has_rival_hooligan_relative,
    enableHiding: true,
    enableSorting: true,
    enablePinning: true,
    // size: 110,
    // minSize: 105,
    // maxSize: 150,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="rivalRelative"
          label={"Has a rival or hooligan relative?"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => {
      const officer = row.original;
      const hasRivalRelative = officer.has_rival_hooligan_relative;

      return (
        <Badge variant={hasRivalRelative ? "danger" : "success"}>
          {hasRivalRelative ? "Yes" : "No"}
        </Badge>
      );
    },
  },
  // Political contact used?
  {
    ...columnId({ id: "politicalContact" }),
    meta: {
      label: "Political contact?",
    },
    accessorFn: (originalRow) => originalRow.political_contact_used,
    enableHiding: true,
    enableSorting: true,
    enablePinning: true,
    // size: 110,
    // minSize: 105,
    // maxSize: 150,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="politicalContact"
          label={"Political contact used?"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => {
      const officer = row.original;
      const politicalContact = officer.political_contact_used;

      return (
        <Badge variant={politicalContact ? "success" : "danger"}>
          {politicalContact ? "Yes" : "No"}
        </Badge>
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
    cell: ({ row }) => (
      <div className="grid place-items-center p-2">
        <RowActions policeOfficer={row.original} />
      </div>
    ),
  },
];
