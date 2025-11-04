"use client";

import { CustomAvatar } from "@/components/custom-avatar";
import { Badge } from "@/components/ui/badge";
import { RoleIcon } from "@/core/auth/components/role-icon";
import { SelectCell } from "@/core/table/components/select-column/cell";
import { SelectHeader } from "@/core/table/components/select-column/header";
import { THeadDropdown } from "@/core/table/components/thead-dropdown";
import { columnId } from "@/core/table/lib/utils/column-id";
import { UserRole } from "@/generated/prisma";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { dateFormatter } from "@/lib/utils/format-date";
import { UserSession } from "@/types/session";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { TransitionStartFunction } from "react";
import RowActions from "./row-actions";

export const userColumns = ({
  isLoading,
  startTransition,
  visibleUsers,
}: {
  isLoading: boolean;
  startTransition: TransitionStartFunction;
  visibleUsers: UserSession[];
}): ColumnDef<UserSession>[] => [
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
      const id = row.original.id;

      return (
        <SelectCell
          id={id}
          isLoading={isLoading}
          startTransition={startTransition}
        />
      );
    },
  },
  // Avatar
  {
    ...columnId({ id: "avatar" }),
    meta: {
      label: "Avatar",
    },
    accessorFn: (originalRow) => originalRow.name.toLowerCase(),
    enableHiding: true,
    enableSorting: false,
    enablePinning: true,
    size: 90,
    minSize: 85,
    maxSize: 100,
    header: ({ column }) => (
      <>
        <THeadDropdown
          id="avatar"
          label={"Avatar"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      </>
    ),
    cell: ({ row }) => {
      const image = row.original.image;
      const userSlug = row.original.slug;

      return (
        <div className="flex flex-col gap-2">
          <Link
            className="flex h-auto items-center justify-start gap-2 p-0 hover:cursor-pointer"
            href={`/profile/${userSlug}`}
          >
            <CustomAvatar image={image} />
          </Link>
        </div>
      );
    },
  },
  // First Name
  {
    ...columnId({ id: "firstName" }),
    meta: {
      label: "First name",
    },
    accessorFn: (originalRow) => originalRow.firstName.toLowerCase(),
    enableHiding: false,
    enableSorting: true,
    enablePinning: true,
    size: 110,
    minSize: 105,
    maxSize: 150,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="firstName"
          label={"First name"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => {
      const firstName = row.original.firstName;
      const userSlug = row.original.slug;

      return (
        <div className="flex flex-col gap-2">
          <Link
            className="flex h-auto items-center justify-start gap-2 p-0 hover:cursor-pointer"
            href={`/profile/${userSlug}`}
          >
            {firstName}
          </Link>
        </div>
      );
    },
  },
  // Last Name
  {
    ...columnId({ id: "lastName" }),
    meta: {
      label: "Last name",
    },
    accessorFn: (originalRow) => originalRow.lastName.toLowerCase(),
    enableHiding: false,
    enableSorting: true,
    enablePinning: true,
    size: 110,
    minSize: 105,
    maxSize: 150,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="lastName"
          label={"Last name"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => {
      const lastName = row.original.lastName;
      const userSlug = row.original.slug;

      return (
        <div className="flex flex-col gap-2">
          <Link
            className="flex h-auto items-center justify-start gap-2 p-0 hover:cursor-pointer"
            href={`/profile/${userSlug}`}
          >
            {lastName}
          </Link>
        </div>
      );
    },
  },
  // Username
  {
    ...columnId({ id: "username" }),
    meta: {
      label: "Username",
    },
    accessorFn: (originalRow) => originalRow.username,
    enableSorting: true,
    enablePinning: true,
    size: 110,
    minSize: 105,
    maxSize: 150,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="username"
          label={"Username"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => {
      const displayUsername = row.original.displayUsername;
      const userSlug = row.original.slug;

      return (
        <Link
          className="flex h-auto items-center justify-start gap-2 p-0 hover:cursor-pointer"
          href={`/profile/${userSlug}`}
        >
          {displayUsername || "-"}
        </Link>
      );
    },
  },
  // Email
  {
    ...columnId({ id: "email" }),
    meta: {
      label: "Email",
    },
    accessorFn: (originalRow) => originalRow.email,
    enableHiding: false,
    enableSorting: true,
    enablePinning: true,
    size: 210,
    minSize: 205,
    maxSize: 250,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="email"
          label={"Email"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => {
      const email = row.original.email;

      return (
        <Link
          className="flex h-auto items-center justify-start gap-2 p-0 hover:cursor-pointer"
          href={`mailto:${email}`}
        >
          {email || "-"}
        </Link>
      );
    },
  },
  // Role
  {
    ...columnId({ id: "role" }),
    meta: {
      label: "Role",
    },
    accessorFn: (originalRow) => originalRow.role,
    enableSorting: true,
    enablePinning: true,
    size: 85,
    minSize: 80,
    maxSize: 100,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="role"
          label={"Role"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => {
      const role = row.original.role as UserRole;

      return role ? (
        <Badge variant="info">
          <RoleIcon role={role} />

          {role}
        </Badge>
      ) : (
        "-"
      );
    },
  },
  // 2FA Enabled
  {
    ...columnId({ id: "twoFactorEnabled" }),
    meta: {
      label: "2FA enabled",
    },
    accessorFn: (originalRow) => originalRow.twoFactorEnabled,
    enableSorting: true,
    enablePinning: true,
    size: 120,
    minSize: 118,
    maxSize: 150,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="twoFactorEnabled"
          label={"2FA Enabled"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => {
      const twoFaEnabled = row.original.twoFactorEnabled;

      return (
        <Badge variant={twoFaEnabled ? "success" : "danger"}>
          {twoFaEnabled ? "YES" : "NO"}
        </Badge>
      );
    },
  },
  // Email Verified
  {
    ...columnId({ id: "emailVerified" }),
    meta: {
      label: "Email verified",
    },
    accessorFn: (originalRow) => originalRow.emailVerified,
    enableSorting: true,
    enablePinning: true,
    size: 130,
    minSize: 127,
    maxSize: 150,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="emailVerified"
          label={"Email Verified"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => {
      const emailVerified = row.original.emailVerified;

      return (
        <Badge variant={emailVerified ? "success" : "warning"}>
          {emailVerified ? "Verified" : "Unverified"}
        </Badge>
      );
    },
  },
  // Banned
  {
    ...columnId({ id: "banned" }),
    meta: {
      label: "Banned",
    },
    accessorFn: (originalRow) => originalRow.banned,
    enableSorting: true,
    enablePinning: true,
    size: 90,
    minSize: 88,
    maxSize: 100,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="banned"
          label={"Banned"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => {
      const banned = row.original.banned;

      return (
        <Badge variant={banned ? "danger" : "success"}>
          {banned ? "YES" : "NO"}
        </Badge>
      );
    },
  },
  // Ban reason
  {
    ...columnId({ id: "banReason" }),
    meta: {
      label: "Ban reason",
    },
    accessorFn: (originalRow) => originalRow.banReason,
    enableSorting: true,
    enablePinning: true,
    size: 120,
    minSize: 110,
    maxSize: 270,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="banReason"
          label={"Ban reason"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },

    cell: ({ row }) => {
      const banReason = row.original.banReason;

      return (
        <div className="flex h-auto items-center justify-start gap-2 p-0">
          {banReason || "-"}
        </div>
      );
    },
  },
  // Ban expires
  {
    ...columnId({ id: "banExpires" }),
    meta: {
      label: "Ban expires",
    },
    accessorFn: (originalRow) => originalRow.banExpires,
    sortingFn: "datetime",
    enableSorting: true,
    enablePinning: true,
    size: 120,
    minSize: 115,
    maxSize: 170,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="banExpires"
          label={"Ban expires"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },
    cell: ({ getValue }) => {
      const date = getValue() as Date | null;
      return date
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
        : "-";
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
    size: 170,
    minSize: 170,
    maxSize: 200,
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
  // Last login at
  {
    ...columnId({ id: "lastLoginAt" }),
    meta: {
      label: "Last login at",
    },
    accessorFn: (originalRow) => originalRow.lastLoginAt,
    sortingFn: "datetime",
    size: 210,
    minSize: 170,
    maxSize: 250,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="lastLoginAt"
          label={"Last login at"}
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
  // Last login method
  {
    ...columnId({ id: "lastLoginMethod" }),
    meta: {
      label: "Last login method",
    },
    accessorFn: (originalRow) => originalRow.lastLoginMethod,
    size: 170,
    minSize: 165,
    maxSize: 200,
    header: ({ column }) => {
      return (
        <THeadDropdown
          id="lastLoginMethod"
          label={"Last login method"}
          isLoading={isLoading}
          startTransition={startTransition}
          column={column}
        />
      );
    },
    cell: ({ row }) => {
      return capitalizeFirstLetter(row.original.lastLoginMethod || "");
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
      const user = row.original;

      return (
        <div className="grid place-items-center p-2">
          <RowActions user={user} />
        </div>
      );
    },
  },
];
