"use client";

import { CustomAvatar } from "@/components/custom-avatar";
import { BossIcon } from "@/components/icons/boss";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { captainRolesTitle } from "@/constants/page-title/captain-roles";
import { traitsTitle } from "@/constants/page-title/traits";
import { SelectCell } from "@/core/table/components/select-column/cell";
import { SelectHeader } from "@/core/table/components/select-column/header";
import { THeadDropdown } from "@/core/table/components/thead-dropdown";
import { columnId } from "@/core/table/lib/utils/column-id";
import { dateFormatter, turnToDate } from "@/lib/utils/format-date";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { TransitionStartFunction } from "react";
import { CrewMember } from "../../types/crew-member";
import Points from "./movement-points";
import RowActions from "./row-actions";
import { SkullIcon } from "lucide-react";

export const columns = ({
  isLoading,
  startTransition,
  visibleUsers,
}: {
  isLoading: boolean;
  startTransition: TransitionStartFunction;
  visibleUsers: CrewMember[];
}): ColumnDef<CrewMember>[] => [
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
  // Full name
  {
    ...columnId({ id: "firstName" }),
    meta: {
      label: "Full name",
    },
    accessorFn: (originalRow) => originalRow.first_name.toLowerCase(),
    enableHiding: false,
    enableSorting: true,
    enablePinning: true,
    size: 205,
    minSize: 205,
    maxSize: 205,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="firstName"
          label={"Full name"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => {
      const member = row.original;
      const firstName = member.first_name;
      const lastName = member.last_name;
      const alias = member.alias;
      const fullName = `${firstName} "${alias}" ${lastName}`;
      const isBoss = member.is_boss;

      const traits = member.traits;
      const captain = member.captain;

      return (
        <div className="flex flex-col gap-2 px-2">
          <div className="mt-auto">
            <ul className="flex items-center justify-end gap-2">
              <li className="me-auto flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      {isBoss && <BossIcon />}
                      {captain && (
                        <Link href={`${captainRolesTitle.href}/${captain.id}`}>
                          <CustomAvatar
                            className="size-6 rounded-md border-none"
                            image={captain.image}
                            fit="contain"
                          />
                        </Link>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isBoss && <p>BOSS</p>}
                    {captain && <p>{captain.name}</p>}
                  </TooltipContent>
                </Tooltip>

                {row.original.is_dead && (
                  <Tooltip>
                    <TooltipTrigger>
                      <SkullIcon className="text-danger" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Killed</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </li>
            </ul>
          </div>
          <div className="my-auto flex items-center gap-2">{fullName}</div>
          <div className="mt-auto">
            <ul className="flex items-center justify-end gap-2">
              {traits.map((trait) => (
                <li key={trait.id}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Link href={`${traitsTitle.href}/${trait.id}`}>
                        <CustomAvatar
                          image={trait.image}
                          className="size-6 rounded-md border-none"
                          fit="contain"
                        />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{trait.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    },
  },
  // Turn recruited
  {
    ...columnId({ id: "turn_recruited" }),
    meta: {
      label: "Turn recruited",
    },
    accessorFn: (originalRow) => originalRow.turn_recruited,
    enableHiding: true,
    enableSorting: true,
    enablePinning: true,
    size: 195,
    minSize: 195,
    maxSize: 195,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="turn_recruited"
          label={"Turn recruited"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => (
      <div className="flex items-center gap-2 px-2">
        <Badge variant={"outline"}>{row.original.turn_recruited}</Badge>

        {dateFormatter({
          date: turnToDate(row.original.turn_recruited),
          options: {
            year: "numeric",
            month: "long",
            day: "numeric",
          },
        })}
      </div>
    ),
  },
  // Driver
  {
    ...columnId({ id: "driver" }),
    meta: {
      label: "Driver",
    },
    accessorFn: (originalRow) => originalRow.driver,
    enableHiding: true,
    enableSorting: true,
    enablePinning: true,
    size: 100,
    minSize: 100,
    maxSize: 100,
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

    cell: ({ row }) => (
      <div className="flex items-center gap-2 px-2">
        <Badge variant={"info"}>{row.original.driver || "N/A"}</Badge>
      </div>
    ),
  },
  // Opportunist
  {
    ...columnId({ id: "opportunist" }),
    meta: {
      label: "Opportunist",
    },
    accessorFn: (originalRow) => originalRow.opportunist,
    enableHiding: true,
    enableSorting: true,
    enablePinning: true,
    size: 140,
    minSize: 140,
    maxSize: 140,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="opportunist"
          label={"Opportunist"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => (
      <div className="flex items-center gap-2 px-2">
        <Badge variant={"info"}>{row.original.opportunist || "N/A"}</Badge>
      </div>
    ),
  },
  // Brawler
  {
    ...columnId({ id: "brawler" }),
    meta: {
      label: "Brawler",
    },
    accessorFn: (originalRow) => originalRow.brawler,
    enableHiding: true,
    enableSorting: true,
    enablePinning: true,
    size: 110,
    minSize: 110,
    maxSize: 110,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="brawler"
          label={"Brawler"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => (
      <div className="flex items-center gap-2 px-2">
        <Badge variant={"info"}>{row.original.brawler || "N/A"}</Badge>
      </div>
    ),
  },
  // MP
  {
    ...columnId({ id: "mp" }),
    meta: {
      label: "MP",
    },
    accessorFn: (originalRow) => originalRow.driver,
    enableHiding: true,
    enableSorting: false,
    enablePinning: true,
    size: 85,
    minSize: 85,
    maxSize: 85,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="mp"
          label={"MP"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-2 px-2">
        <Points crewMember={row.original} type="MOVEMENT" />
      </div>
    ),
  },
  // AP
  {
    ...columnId({ id: "ap" }),
    meta: {
      label: "AP",
    },
    accessorFn: (originalRow) => originalRow.driver,
    enableHiding: true,
    enableSorting: false,
    enablePinning: true,
    size: 85,
    minSize: 85,
    maxSize: 85,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="ap"
          label={"AP"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 px-2">
          <Points crewMember={row.original} type="ACTION" />
        </div>
      );
    },
  },
  // Door dash
  {
    ...columnId({ id: "door_dash" }),
    meta: {
      label: "Door dash",
    },
    accessorFn: (originalRow) => originalRow.door_dash,
    enableHiding: true,
    enableSorting: true,
    enablePinning: true,
    size: 130,
    minSize: 130,
    maxSize: 130,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="door_dash"
          label={"Door dash"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => (
      <div className="flex items-center gap-2 px-2">
        <Badge variant={"info"}>{row.original.door_dash || "N/A"}</Badge>
      </div>
    ),
  },
  // Alley ace
  {
    ...columnId({ id: "alley_ace" }),
    meta: {
      label: "Alley ace",
    },
    accessorFn: (originalRow) => originalRow.alley_ace,
    enableHiding: true,
    enableSorting: true,
    enablePinning: true,
    size: 120,
    minSize: 120,
    maxSize: 120,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="alley_ace"
          label={"Alley ace"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => (
      <div className="flex items-center gap-2 px-2">
        <Badge variant={"info"}>{row.original.alley_ace || "N/A"}</Badge>
      </div>
    ),
  },
  // House manager
  {
    ...columnId({ id: "house_manager" }),
    meta: {
      label: "House manager",
    },
    accessorFn: (originalRow) => originalRow.house_manager,
    enableHiding: true,
    enableSorting: true,
    enablePinning: true,
    size: 165,
    minSize: 165,
    maxSize: 165,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="house_manager"
          label={"House manager"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => (
      <div className="flex items-center gap-2 px-2">
        <Badge variant={"info"}>{row.original.house_manager || "N/A"}</Badge>
      </div>
    ),
  },
  // Mechanically minded
  {
    ...columnId({ id: "mechanically_minded" }),
    meta: {
      label: "Mechanically minded",
    },
    accessorFn: (originalRow) => originalRow.mechanically_minded,
    enableHiding: true,
    enableSorting: true,
    enablePinning: true,
    size: 200,
    minSize: 200,
    maxSize: 200,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="mechanically_minded"
          label={"Mechanically minded"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => (
      <div className="flex items-center gap-2 px-2">
        <Badge variant={"info"}>
          {row.original.mechanically_minded || "N/A"}
        </Badge>
      </div>
    ),
  },
  // Pit boss
  {
    ...columnId({ id: "pit_boss" }),
    meta: {
      label: "Pit boss",
    },
    accessorFn: (originalRow) => originalRow.pit_boss,
    enableHiding: true,
    enableSorting: true,
    enablePinning: true,
    size: 115,
    minSize: 115,
    maxSize: 115,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="pit_boss"
          label={"Pit boss"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => (
      <div className="flex items-center gap-2 px-2">
        <Badge variant={"info"}>{row.original.pit_boss || "N/A"}</Badge>
      </div>
    ),
  },
  // Production manager
  {
    ...columnId({ id: "production_manager" }),
    meta: {
      label: "Production manager",
    },
    accessorFn: (originalRow) => originalRow.production_manager,
    enableHiding: true,
    enableSorting: true,
    enablePinning: true,
    size: 200,
    minSize: 200,
    maxSize: 200,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="production_manager"
          label={"Production manager"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => (
      <div className="flex items-center gap-2 px-2">
        <Badge variant={"info"}>
          {row.original.production_manager || "N/A"}
        </Badge>
      </div>
    ),
  },
  // Booze manufacture
  {
    ...columnId({ id: "booze_manufacture" }),
    meta: {
      label: "Booze manufacture",
    },
    accessorFn: (originalRow) => originalRow.booze_manufacture,
    enableHiding: true,
    enableSorting: true,
    enablePinning: true,
    size: 200,
    minSize: 200,
    maxSize: 200,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="booze_manufacture"
          label={"Booze manufacture"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => (
      <div className="flex items-center gap-2 px-2">
        <Badge variant={"info"}>
          {row.original.booze_manufacture || "N/A"}
        </Badge>
      </div>
    ),
  },
  // Booze upgrade
  {
    ...columnId({ id: "booze_upgrade" }),
    meta: {
      label: "Booze upgrade",
    },
    accessorFn: (originalRow) => originalRow.booze_upgrade,
    enableHiding: true,
    enableSorting: true,
    enablePinning: true,
    size: 200,
    minSize: 200,
    maxSize: 200,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="booze_upgrade"
          label={"Booze upgrade"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => (
      <div className="flex items-center gap-2 px-2">
        <Badge variant={"info"}>{row.original.booze_upgrade || "N/A"}</Badge>
      </div>
    ),
  },
  // Methodical organizer
  {
    ...columnId({ id: "methodical_organizer" }),
    meta: {
      label: "Methodical organizer",
    },
    accessorFn: (originalRow) => originalRow.methodical_organizer,
    enableHiding: true,
    enableSorting: true,
    enablePinning: true,
    size: 200,
    minSize: 200,
    maxSize: 200,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="methodical_organizer"
          label={"Methodical organizer"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => (
      <div className="flex items-center gap-2 px-2">
        <Badge variant={"info"}>
          {row.original.methodical_organizer || "N/A"}
        </Badge>
      </div>
    ),
  },
  // Counter chin wagger
  {
    ...columnId({ id: "counter_chin_wagger" }),
    meta: {
      label: "Counter chin wagger",
    },
    accessorFn: (originalRow) => originalRow.counter_chin_wagger,
    enableHiding: true,
    enableSorting: true,
    enablePinning: true,
    size: 200,
    minSize: 200,
    maxSize: 200,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="counter_chin_wagger"
          label={"Counter chin wagger"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => (
      <div className="flex items-center gap-2 px-2">
        <Badge variant={"info"}>
          {row.original.counter_chin_wagger || "N/A"}
        </Badge>
      </div>
    ),
  },
  // Speakeasy manager
  {
    ...columnId({ id: "speakeasy_manager" }),
    meta: {
      label: "Speakeasy manager",
    },
    accessorFn: (originalRow) => originalRow.speakeasy_manager,
    enableHiding: true,
    enableSorting: true,
    enablePinning: true,
    size: 200,
    minSize: 200,
    maxSize: 200,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="speakeasy_manager"
          label={"Speakeasy manager"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => (
      <div className="flex items-center gap-2 px-2">
        <Badge variant={"info"}>
          {row.original.speakeasy_manager || "N/A"}
        </Badge>
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
    size: 110,
    minSize: 110,
    maxSize: 110,
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
        <RowActions crewMember={row.original} />
      </div>
    ),
  },
];
