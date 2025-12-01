"use client";

import { CustomAvatar } from "@/components/custom-avatar";
import { CustomButton } from "@/components/custom-button";
import { ResourceIcon } from "@/components/icons/resource";
import { buildingTitle } from "@/constants/page-title/building";
import { buildingBackroomsTitle } from "@/constants/page-title/building-backrooms";
import { buildingPassiveTitle } from "@/constants/page-title/building-passive";
import { buildingPassiveDurationTitle } from "@/constants/page-title/building-passive-duration";
import { buildingSizesTitle } from "@/constants/page-title/building-sizes";
import { buildingTypesTitle } from "@/constants/page-title/building-types";
import { crewMembersTitle } from "@/constants/page-title/crew-members";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { Building } from "@/core/cog/building/types/building";
import { SelectCell } from "@/core/table/components/select-column/cell";
import { SelectHeader } from "@/core/table/components/select-column/header";
import { THeadDropdown } from "@/core/table/components/thead-dropdown";
import { columnId } from "@/core/table/lib/utils/column-id";
import { dateFormatter } from "@/lib/utils/format-date";
import { ft3m3 } from "@/lib/utils/ft3-m3";
import { setFullName } from "@/lib/utils/full-name";
import { ColumnDef } from "@tanstack/react-table";
import { Fragment, TransitionStartFunction } from "react";
import RowActions from "./row-actions";
import Link from "next/link";

export const columns = ({
  isLoading,
  startTransition,
  visibleUsers,
  respectForTheLaw = false,
}: {
  isLoading: boolean;
  startTransition: TransitionStartFunction;
  visibleUsers: Building[];
  respectForTheLaw?: boolean;
}): ColumnDef<Building>[] => [
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
      <CustomButton
        buttonLabel={row.original.name}
        linkHref={`${playthroughTitle.href}/${row.original.playthrough.id + buildingTitle.href}/${row.original.id}`}
        size={"sm"}
        variant={"link"}
        skeletonClassName="h-9 w-[121px]"
        noEffect
      />
    ),
  },
  // Type
  {
    ...columnId({ id: "type" }),
    meta: {
      label: "Type",
    },
    accessorFn: (originalRow) => originalRow.type?.name.toLowerCase(),
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

    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        {row.original.type ? (
          <CustomButton
            buttonLabel={String(row.original.type.name)}
            linkHref={`${buildingTypesTitle.href}/${row.original.type.id}`}
            size={"sm"}
            variant={"link"}
            skeletonClassName="h-9 w-[121px]"
            noEffect
          />
        ) : (
          <div className="px-3">None</div>
        )}
      </div>
    ),
  },
  // Size
  {
    ...columnId({ id: "size" }),
    meta: {
      label: "Size",
    },
    accessorFn: (originalRow) => originalRow.size.capacity,
    enableHiding: true,
    enableSorting: true,
    enablePinning: true,
    // size: 110,
    // minSize: 105,
    // maxSize: 150,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="size"
          label={"Size"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <CustomButton
          buttonLabel={String(row.original.size.name)}
          linkHref={`${buildingSizesTitle.href}/${row.original.size.id}`}
          size={"sm"}
          variant={"link"}
          skeletonClassName="h-9 w-[121px]"
          noEffect
        />

        <small
          dangerouslySetInnerHTML={{
            __html: `(${ft3m3(row.original.size.capacity).html})`,
          }}
        />
      </div>
    ),
  },
  // Manager
  {
    ...columnId({ id: "manager" }),
    meta: {
      label: "Manager",
    },
    accessorFn: (originalRow) => originalRow.manager?.full_name,
    enableHiding: true,
    enableSorting: true,
    enablePinning: true,
    // size: 110,
    // minSize: 105,
    // maxSize: 150,
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
      <div className="flex items-center gap-1">
        {row.original.manager ? (
          <CustomButton
            buttonLabel={
              setFullName({
                firstName: row.original.manager.first_name,
                lastName: row.original.manager.last_name,
                alias: row.original.manager.alias,
              }).outputFE
            }
            linkHref={`${playthroughTitle.href}/${row.original.playthrough_id + crewMembersTitle.href}/${row.original.manager.id}`}
            size={"sm"}
            variant={"link"}
            skeletonClassName="h-9 w-[121px]"
            noEffect
          />
        ) : (
          <div className="px-3">None</div>
        )}
      </div>
    ),
  },
  // Backroom
  {
    ...columnId({ id: "backroom" }),
    meta: {
      label: "Backroom",
    },
    accessorFn: (originalRow) => originalRow.backroom?.name.toLowerCase(),
    enableHiding: true,
    enableSorting: true,
    enablePinning: true,
    // size: 110,
    // minSize: 105,
    // maxSize: 150,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="backroom"
          label={"Backroom"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        {row.original.backroom ? (
          <CustomButton
            buttonLabel={String(row.original.backroom.name)}
            linkHref={`${buildingBackroomsTitle.href}/${row.original.backroom.id}`}
            size={"sm"}
            variant={"link"}
            skeletonClassName="h-9 w-[121px]"
            noEffect
          />
        ) : (
          <div className="px-3">None</div>
        )}
      </div>
    ),
  },
  // Passive production
  {
    ...columnId({ id: "passiveProduction" }),
    meta: {
      label: "Passive production",
    },
    accessorFn: (originalRow) => originalRow.backroom?.name.toLowerCase(),
    enableHiding: true,
    enableSorting: false,
    enablePinning: true,
    // size: 110,
    // minSize: 105,
    // maxSize: 150,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="passiveProduction"
          label={"Passive production"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => (
      <div className="flex items-center gap-1 px-3">
        {row.original.passive_productions.length ? (
          row.original.passive_productions.map((production) => (
            <Fragment key={production.id}>
              <Link href={`${buildingPassiveTitle.href}/${production.id}`}>
                <CustomAvatar
                  image={production.resource.image}
                  className="size-6 rounded-sm border-none"
                  icon={<ResourceIcon />}
                  fit="contain"
                />
              </Link>
              <CustomButton
                buttonLabel={`${production.resource.name} (${production.quantity})`}
                linkHref={`${buildingPassiveTitle.href}/${production.id}`}
                size={"sm"}
                variant={"link"}
                skeletonClassName="size-8"
                noEffect
              />
            </Fragment>
          ))
        ) : (
          <div className="">None</div>
        )}
      </div>
    ),
  },
  // Passive production duration
  {
    ...columnId({ id: "passiveDuration" }),
    meta: {
      label: "Passive production duration",
    },
    accessorFn: (originalRow) =>
      originalRow.passive_productions_duration?.turns,
    enableHiding: true,
    enableSorting: true,
    enablePinning: true,
    // size: 110,
    // minSize: 105,
    // maxSize: 150,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="passiveDuration"
          label={"Passive production duration"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        {row.original.passive_productions_duration ? (
          <CustomButton
            buttonLabel={`${row.original.passive_productions_duration.turns * 7} days / ${row.original.passive_productions_duration.turns} turns`}
            linkHref={`${buildingPassiveDurationTitle.href}/${row.original.passive_productions_duration.id}`}
            size={"sm"}
            variant={"link"}
            skeletonClassName="h-9 w-[121px]"
            noEffect
          />
        ) : (
          <div className="px-3">None</div>
        )}
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
        <RowActions building={row.original} />
      </div>
    ),
  },
];
