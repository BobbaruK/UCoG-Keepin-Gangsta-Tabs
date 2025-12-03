"use client";

import { CustomAvatar } from "@/components/custom-avatar";
import { CustomButton } from "@/components/custom-button";
import { AutoRouteIcon } from "@/components/icons/auto-route";
import { BossIcon } from "@/components/icons/boss";
import { BuildingIcon } from "@/components/icons/building";
import { CaptainRoleIcon } from "@/components/icons/captain-role";
import { GamblingBuildingIcon } from "@/components/icons/gambling-building";
import { NationalityIcon } from "@/components/icons/nationality";
import { TraitsIcon } from "@/components/icons/traits";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { autoRoutesTitle } from "@/constants/page-title/auto-routes";
import { buildingTitle } from "@/constants/page-title/building";
import { captainRolesTitle } from "@/constants/page-title/captain-roles";
import { crewLevelsTitle } from "@/constants/page-title/crew-levels";
import { crewMembersTitle } from "@/constants/page-title/crew-members";
import { gamblingBuildingsTitle } from "@/constants/page-title/gambling-buildings";
import { nationalitiesTitle } from "@/constants/page-title/nationalities";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { traitsTitle } from "@/constants/page-title/traits";
import { CrewMember } from "@/core/cog/crew-member/types/crew-member";
import { SelectCell } from "@/core/table/components/select-column/cell";
import { SelectHeader } from "@/core/table/components/select-column/header";
import { THeadDropdown } from "@/core/table/components/thead-dropdown";
import { columnId } from "@/core/table/lib/utils/column-id";
import { CrewLevelType } from "@/generated/prisma";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { dateFormatter, turnToDate } from "@/lib/utils/format-date";
import { setFullName } from "@/lib/utils/full-name";
import { ColumnDef } from "@tanstack/react-table";
import { SkullIcon } from "lucide-react";
import Link from "next/link";
import { TransitionStartFunction } from "react";
import Points from "./points";
import RowActions from "./row-actions";

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
    ...columnId({ id: "full_name" }),
    meta: {
      label: "Full name",
    },
    accessorFn: (originalRow) => originalRow.full_name.toLowerCase(),
    enableHiding: false,
    enableSorting: true,
    enablePinning: true,
    size: 205,
    minSize: 205,
    maxSize: 205,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="full_name"
          label={"Full name"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => {
      const member = row.original;
      const memberId = member.id;
      const firstName = member.first_name;
      const lastName = member.last_name;
      const alias = member.alias;
      const fullName = setFullName({
        firstName,
        lastName,
        alias,
      }).outputFE;
      const isBoss = member.is_boss;

      const nationality = member.nationality;
      const nationalityId = nationality.id;
      const nationalityName = nationality.name;
      const nationalityFlag = nationality.flag;

      const traits = member.traits;
      const captain = member.captain;

      return (
        <div className="flex flex-col gap-2 px-2.5">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`${nationalitiesTitle.href}/${nationalityId}`}>
                    <CustomAvatar
                      className="size-6 rounded-md border-none"
                      image={nationalityFlag}
                      icon={<NationalityIcon size={16} />}
                      fit="contain"
                    />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{nationalityName}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            {(isBoss || captain) && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      {isBoss && <BossIcon />}
                      {captain && (
                        <Link href={`${captainRolesTitle.href}/${captain.id}`}>
                          <CustomAvatar
                            className="size-6 rounded-md border-none"
                            image={captain.image}
                            icon={<CaptainRoleIcon size={16} />}
                            fit="contain"
                          />
                        </Link>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isBoss && <p>BOSS</p>}
                    {captain && <p>Role: {captain.name}</p>}
                  </TooltipContent>
                </Tooltip>
              </>
            )}
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

            {row.original.cogAutoRoute && (
              <Tooltip>
                <TooltipTrigger asChild className="ms-auto">
                  <Link
                    href={`${playthroughTitle.href}/${row.original.cog_playthroughId + autoRoutesTitle.href}/${row.original.cogAutoRoute.id}`}
                  >
                    <AutoRouteIcon size={16} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  {capitalizeFirstLetter(
                    autoRoutesTitle.label.singular.toLowerCase(),
                  )}
                  : <strong>{row.original.cogAutoRoute.name}</strong>
                </TooltipContent>
              </Tooltip>
            )}
            {row.original.cogBuildings && (
              <Tooltip>
                <TooltipTrigger asChild className="ms-auto">
                  <Link
                    href={`${playthroughTitle.href}/${row.original.cog_playthroughId + buildingTitle.href}/${row.original.cogBuildings.id}`}
                  >
                    <BuildingIcon size={16} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  {capitalizeFirstLetter(
                    buildingTitle.label.singular.toLowerCase(),
                  )}
                  :{" "}
                  <strong>
                    {" "}
                    {row.original.cogBuildings.name}{" "}
                    {row.original.cogBuildings.backroom &&
                      `(${row.original.cogBuildings.backroom.name})`}
                  </strong>
                </TooltipContent>
              </Tooltip>
            )}
            {row.original.cogGamblingBuilding && (
              <Tooltip>
                <TooltipTrigger asChild className="ms-auto">
                  <Link
                    href={`${playthroughTitle.href}/${row.original.cog_playthroughId + gamblingBuildingsTitle.href}/${row.original.cogGamblingBuilding.id}`}
                  >
                    <GamblingBuildingIcon size={16} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  {capitalizeFirstLetter(
                    gamblingBuildingsTitle.label.singular.toLowerCase(),
                  )}
                  : <strong>{row.original.cogGamblingBuilding.name}</strong>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <div className="my-auto">
            <CustomButton
              buttonLabel={fullName}
              size={"sm"}
              variant={"link"}
              noEffect
              className="p-0"
              linkHref={`${playthroughTitle.href}/${member.playthrough.id + crewMembersTitle.href}/${memberId}`}
              skeletonClassName="h-8 w-[120px]"
            />
          </div>
          {traits.length > 0 && (
            <div className="flex items-center gap-2">
              {/* <span className="text-muted-foreground">Traits: </span> */}
              <ul className="flex items-center gap-2">
                {traits.map((trait) => (
                  <li key={trait.id}>
                    <Tooltip>
                      <TooltipTrigger>
                        <Link href={`${traitsTitle.href}/${trait.id}`}>
                          <CustomAvatar
                            image={trait.image}
                            icon={<TraitsIcon size={16} />}
                            className="block size-6 rounded-md border-none"
                            fit="contain"
                          />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Trait: {trait.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </li>
                ))}
              </ul>
            </div>
          )}
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
      <div className="flex items-center gap-2 px-2.5">
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
  // MP
  {
    ...columnId({ id: "mp" }),
    meta: {
      label: "MP",
    },
    // accessorFn: (originalRow) => originalRow.driver,
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
      <div className="flex items-center gap-2 px-2.5">
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
    // accessorFn: (originalRow) => originalRow.driver,
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
        <div className="flex items-center gap-2 px-2.5">
          <Points crewMember={row.original} type="ACTION" />
        </div>
      );
    },
  },
  // Driver skills
  {
    ...columnId({ id: "driver_skills" }),
    meta: {
      label: "Driver skills",
    },
    // accessorFn: (originalRow) => originalRow.full_name.toLowerCase(),
    enableHiding: true,
    enableSorting: false,
    enablePinning: true,
    size: 205,
    minSize: 205,
    maxSize: 205,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="driver_skills"
          label={"Driver skills"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => {
      const member = row.original;
      const experience = member.experience.filter(
        (exp) => exp.level.type === CrewLevelType.DRIVER,
      );

      return (
        <div className="flex flex-col gap-2 px-2.5">
          {experience.length > 0 ? (
            <ul className="flex flex-col gap-1">
              {experience.map((exp) => {
                const xpName = exp.level.name;
                const xpValue = exp.value;
                const levelId = exp.level.id;

                return (
                  <li key={exp.id} className="flex items-center gap-2">
                    <CustomButton
                      buttonLabel={xpName}
                      size={"sm"}
                      variant={"link"}
                      noEffect
                      className="p-0"
                      linkHref={`${crewLevelsTitle.href}/${levelId}`}
                      skeletonClassName="h-8 w-[120px]"
                    />

                    <Badge>{xpValue}</Badge>
                  </li>
                );
              })}
            </ul>
          ) : (
            "None"
          )}
        </div>
      );
    },
  },
  // Gambling skills
  {
    ...columnId({ id: "gambling_skills" }),
    meta: {
      label: "Gambling skills",
    },
    // accessorFn: (originalRow) => originalRow.full_name.toLowerCase(),
    enableHiding: true,
    enableSorting: false,
    enablePinning: true,
    size: 205,
    minSize: 205,
    maxSize: 205,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="gambling_skills"
          label={"Gambling skills"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => {
      const member = row.original;
      const experience = member.experience.filter(
        (exp) => exp.level.type === CrewLevelType.GAMBLING,
      );

      return (
        <div className="flex flex-col gap-2 px-2.5">
          {experience.length > 0 ? (
            <ul className="flex flex-col gap-1">
              {experience.map((exp) => {
                const xpName = exp.level.name;
                const xpValue = exp.value;
                const levelId = exp.level.id;

                return (
                  <li key={exp.id} className="flex items-center gap-2">
                    <CustomButton
                      buttonLabel={xpName}
                      size={"sm"}
                      variant={"link"}
                      noEffect
                      className="p-0"
                      linkHref={`${crewLevelsTitle.href}/${levelId}`}
                      skeletonClassName="h-8 w-[120px]"
                    />

                    <Badge>{xpValue}</Badge>
                  </li>
                );
              })}
            </ul>
          ) : (
            "None"
          )}
        </div>
      );
    },
  },
  // General managers skills
  {
    ...columnId({ id: "general_manager_skills" }),
    meta: {
      label: "General managers skills",
    },
    // accessorFn: (originalRow) => originalRow.full_name.toLowerCase(),
    enableHiding: true,
    enableSorting: false,
    enablePinning: true,
    size: 205,
    minSize: 205,
    maxSize: 205,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="general_manager_skills"
          label={"General managers skills"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => {
      const member = row.original;
      const experience = member.experience.filter(
        (exp) => exp.level.type === CrewLevelType.GENERAL,
      );

      return (
        <div className="flex flex-col gap-2 px-2.5">
          {experience.length > 0 ? (
            <ul className="flex flex-col gap-1">
              {experience.map((exp) => {
                const xpName = exp.level.name;
                const xpValue = exp.value;
                const levelId = exp.level.id;

                return (
                  <li key={exp.id} className="flex items-center gap-2">
                    <CustomButton
                      buttonLabel={xpName}
                      size={"sm"}
                      variant={"link"}
                      noEffect
                      className="p-0"
                      linkHref={`${crewLevelsTitle.href}/${levelId}`}
                      skeletonClassName="h-8 w-[120px]"
                    />

                    <Badge>{xpValue}</Badge>
                  </li>
                );
              })}
            </ul>
          ) : (
            "None"
          )}
        </div>
      );
    },
  },
  // Production skills
  {
    ...columnId({ id: "production_skills" }),
    meta: {
      label: "Production skills",
    },
    // accessorFn: (originalRow) => originalRow.full_name.toLowerCase(),
    enableHiding: true,
    enableSorting: false,
    enablePinning: true,
    size: 205,
    minSize: 205,
    maxSize: 205,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="production_skills"
          label={"Production skills"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => {
      const member = row.original;
      const experience = member.experience.filter(
        (exp) => exp.level.type === CrewLevelType.PRODUCTION,
      );

      return (
        <div className="flex flex-col gap-2 px-2.5">
          {experience.length > 0 ? (
            <ul className="flex flex-col gap-1">
              {experience.map((exp) => {
                const xpName = exp.level.name;
                const xpValue = exp.value;
                const levelId = exp.level.id;

                return (
                  <li key={exp.id} className="flex items-center gap-2">
                    <CustomButton
                      buttonLabel={xpName}
                      size={"sm"}
                      variant={"link"}
                      noEffect
                      className="p-0"
                      linkHref={`${crewLevelsTitle.href}/${levelId}`}
                      skeletonClassName="h-8 w-[120px]"
                    />

                    <Badge>{xpValue}</Badge>
                  </li>
                );
              })}
            </ul>
          ) : (
            "None"
          )}
        </div>
      );
    },
  },
  // Speakeasy skills
  {
    ...columnId({ id: "speakeasy_skills" }),
    meta: {
      label: "Speakeasy skills",
    },
    // accessorFn: (originalRow) => originalRow.full_name.toLowerCase(),
    enableHiding: true,
    enableSorting: false,
    enablePinning: true,
    size: 205,
    minSize: 205,
    maxSize: 205,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="speakeasy_skills"
          label={"Speakeasy skills"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => {
      const member = row.original;
      const experience = member.experience.filter(
        (exp) => exp.level.type === CrewLevelType.SPEAKEASY,
      );

      return (
        <div className="flex flex-col gap-2 px-2.5">
          {experience.length > 0 ? (
            <ul className="flex flex-col gap-1">
              {experience.map((exp) => {
                const xpName = exp.level.name;
                const xpValue = exp.value;
                const levelId = exp.level.id;

                return (
                  <li key={exp.id} className="flex items-center gap-2">
                    <CustomButton
                      buttonLabel={xpName}
                      size={"sm"}
                      variant={"link"}
                      noEffect
                      className="p-0"
                      linkHref={`${crewLevelsTitle.href}/${levelId}`}
                      skeletonClassName="h-8 w-[120px]"
                    />
                    <Badge>{xpValue}</Badge>
                  </li>
                );
              })}
            </ul>
          ) : (
            "None"
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
      <div className="p-2">
        <RowActions crewMember={row.original} />
      </div>
    ),
  },
];
