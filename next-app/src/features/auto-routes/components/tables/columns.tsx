"use client";

import { CustomButton } from "@/components/custom-button";
import { autoRouteTypesTitle } from "@/constants/page-title/auto-route-types";
import { autoRoutesTitle } from "@/constants/page-title/auto-routes";
import { crewMembersTitle } from "@/constants/page-title/crew-members";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { vehicleTypesTitle } from "@/constants/page-title/vehicle-types";
import { AutoRoute } from "@/core/cog/auto-route/types/auto-route";
import { SelectCell } from "@/core/table/components/select-column/cell";
import { SelectHeader } from "@/core/table/components/select-column/header";
import { THeadDropdown } from "@/core/table/components/thead-dropdown";
import { columnId } from "@/core/table/lib/utils/column-id";
import { dateFormatter } from "@/lib/utils/format-date";
import { ft3m3 } from "@/lib/utils/ft3-m3";
import { setFullName } from "@/lib/utils/full-name";
import { ColumnDef } from "@tanstack/react-table";
import { TransitionStartFunction } from "react";
import RowActions from "./row-actions";
import { Badge } from "@/components/ui/badge";

export const columns = ({
  isLoading,
  startTransition,
  visibleUsers,
  respectForTheLaw = false,
}: {
  isLoading: boolean;
  startTransition: TransitionStartFunction;
  visibleUsers: AutoRoute[];
  respectForTheLaw?: boolean;
}): ColumnDef<AutoRoute>[] => [
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
        linkHref={`${playthroughTitle.href}/${row.original.cog_playthroughId + autoRoutesTitle.href}/${row.original.id}`}
        size={"sm"}
        variant={"link"}
        skeletonClassName="h-9 w-[121px]"
        noEffect
      />
    ),
  },
  // Driver
  {
    ...columnId({ id: "driver" }),
    meta: {
      label: "Driver",
    },
    accessorFn: (originalRow) =>
      originalRow.crew_member?.full_name.toLowerCase(),
    enableHiding: true,
    enableSorting: true,
    enablePinning: true,
    size: 110,
    minSize: 105,
    maxSize: 150,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="driver"
          label={"Driver"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => {
      if (!row.original.crew_member) return <div className="px-3">None</div>;

      return (
        <CustomButton
          buttonLabel={
            setFullName({
              firstName: row.original.crew_member.first_name,
              lastName: row.original.crew_member.last_name,
              alias: row.original.crew_member.alias,
            }).outputFE
          }
          linkHref={`${playthroughTitle.href}/${row.original.cog_playthroughId + crewMembersTitle.href}/${row.original.crew_member.id}`}
          size={"sm"}
          variant={"link"}
          skeletonClassName="h-9 w-[121px]"
          noEffect
        />
      );
    },
  },
  // Type
  {
    ...columnId({ id: "type" }),
    meta: {
      label: "Type",
    },
    // accessorFn: (originalRow) => originalRow.vehicle_type?.name.toLowerCase(),
    enableHiding: true,
    enableSorting: false,
    enablePinning: true,
    size: 110,
    minSize: 105,
    maxSize: 150,
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
      if (!row.original.route_type.length)
        return <div className="px-3">None</div>;

      return row.original.route_type.map((type) => (
        <CustomButton
          key={type.id}
          buttonLabel={type.name}
          linkHref={`${autoRouteTypesTitle.href}/${type.id}`}
          size={"sm"}
          variant={"link"}
          skeletonClassName="h-8 w-[71px]"
          noEffect
        />
      ));
    },
  },
  // Vehicle type
  {
    ...columnId({ id: "vehicle_type" }),
    meta: {
      label: "Vehicle type",
    },
    accessorFn: (originalRow) => originalRow.vehicle_type?.name.toLowerCase(),
    enableHiding: true,
    enableSorting: true,
    enablePinning: true,
    size: 110,
    minSize: 105,
    maxSize: 150,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="vehicle_type"
          label={"Vehicle type"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => {
      if (!row.original.vehicle_type) return <div className="px-3">None</div>;

      return (
        <div className="flex items-center gap-1">
          <CustomButton
            buttonLabel={row.original.vehicle_type.name}
            linkHref={`${vehicleTypesTitle.href}/${row.original.cog_vehicle_typeId}`}
            size={"sm"}
            variant={"link"}
            skeletonClassName="h-9 w-[121px]"
            noEffect
          />

          <small
            dangerouslySetInnerHTML={{
              __html: `(${ft3m3(row.original.vehicle_type.capacity).html})`,
            }}
          />
        </div>
      );
    },
  },
  // Steps
  {
    ...columnId({ id: "steps" }),
    meta: {
      label: "Steps",
    },
    accessorFn: (originalRow) => originalRow.steps,
    enableHiding: true,
    enableSorting: true,
    enablePinning: true,
    size: 110,
    minSize: 105,
    maxSize: 150,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="steps"
          label={"Steps"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => (
      <div className="px-3">
        <Badge>{row.original.steps}</Badge>
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
    cell: ({ row }) => (
      <div className="grid place-items-center p-2">
        <RowActions autoRoute={row.original} />
      </div>
    ),
  },
];
