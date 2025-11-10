"use client";

import { CustomButton } from "@/components/custom-button";
import { BanIcon } from "@/components/icons/ban";
import { CopyIcon } from "@/components/icons/copy";
import { RolesIcon } from "@/components/icons/roles";
import { ShieldBanIcon } from "@/components/icons/shield-ban";
import { TrashIcon } from "@/components/icons/trash";
import { UnbanIcon } from "@/components/icons/unban";
import ResponsiveDialog from "@/components/responsive-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BATCH_ITEMS } from "@/constants/misc";
import { unbanUser } from "@/core/admin/users/actions/ban-user";
import { revokeUserSessions } from "@/core/admin/users/actions/revoke-sessions";
import { setUserRole } from "@/core/admin/users/actions/set-user-role";
import DeleteUser from "@/core/admin/users/components/delete-user";
import { BanUserFormSkeleton } from "@/core/admin/users/components/forms/ban-user";
import { RoleIcon as RoleIconComp } from "@/core/auth/components/role-icon";
import { useTableContext } from "@/core/table/providers/table-provider";
import { UserRole } from "@/generated/prisma";
import { useCustomCopyToClipboard } from "@/hooks/use-custom-copy-to-clipboard";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { chunkArray } from "@/lib/utils/chunk-array";
import { UserSession } from "@/types/session";
import { lazy, Suspense, useState } from "react";
import { toast } from "sonner";
const BanUserForm = lazy(
  () => import("@/core/admin/users/components/forms/ban-user"),
);

const PaginationActions = () => {
  const { isLoading, startTransition, dataSelected } =
    useTableContext<UserSession>();
  const [openBanDialog, setOpenBanDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { handleCopy } = useCustomCopyToClipboard();

  const userIdBatches = chunkArray(dataSelected, BATCH_ITEMS);
  const roles = Object.values(UserRole);

  const handleRevokeUserSessions = () => {
    startTransition(async () => {
      for (const batch of userIdBatches) {
        const results = (await Promise.allSettled(
          batch.map((user) => revokeUserSessions(user)),
        )) as {
          status: string;
          value: {
            error?: string;
            success?: string;
          };
        }[];

        for (const result of results) {
          // console.log(result.value);

          if (result.value.error) toast.error(result.value.error);
          if (result.value.success) toast.success(result.value.success);
        }

        // console.log("Batch done:", results);
        await new Promise((r) => setTimeout(r, 200));
      }
    });
  };

  const handleChangeUserRole = (newRole: UserRole) => {
    startTransition(async () => {
      for (const batch of userIdBatches) {
        const results = (await Promise.allSettled(
          batch.map((user) => setUserRole({ user, role: newRole })),
        )) as {
          status: string;
          value: {
            error?: string;
            success?: string;
          };
        }[];

        for (const result of results) {
          // console.log(result.value);

          if (result.value.error) toast.error(result.value.error);
          if (result.value.success) toast.success(result.value.success);
        }

        // console.log("Batch done:", results);
        await new Promise((r) => setTimeout(r, 200));
      }
    });
  };

  const handleUnban = () => {
    startTransition(async () => {
      for (const batch of userIdBatches) {
        const results = (await Promise.allSettled(
          batch.map((user) => {
            return unbanUser(user);
          }),
        )) as {
          status: string;
          value: {
            error?: string;
            success?: string;
          };
        }[];

        for (const result of results) {
          // console.log(result.value);

          if (result.value.error) toast.error(result.value.error);
          if (result.value.success) toast.success(result.value.success);
        }

        // console.log("Batch done:", results);
        await new Promise((r) => setTimeout(r, 200));
      }
    });
  };

  return (
    <>
      <ResponsiveDialog
        open={openBanDialog}
        setOpen={setOpenBanDialog}
        trigger={{
          type: "label",
          label: "Ban",
          hidden: true,
        }}
        header={{
          title: {
            label: "Ban user(s)",
          },
        }}
      >
        <Suspense fallback={<BanUserFormSkeleton />}>
          <BanUserForm
            users={dataSelected}
            isLoading={isLoading}
            startTransition={startTransition}
            setOpenBanDialog={setOpenBanDialog}
          />
        </Suspense>
      </ResponsiveDialog>

      <ResponsiveDialog
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        trigger={{
          type: "element",
          element: (
            <CustomButton
              buttonLabel="Delete"
              variant={"destructive"}
              className="w-full"
              disabled={isLoading}
              onClick={() => setOpenDeleteDialog(true)}
            />
          ),
          hidden: true,
        }}
        header={{
          title: {
            label: "Are you absolutely sure?",
          },
          description:
            "This action cannot be undone. This will permanently delete this account and remove it's data from our servers.",
        }}
      >
        <DeleteUser
          users={dataSelected}
          isLoading={isLoading}
          startTransition={startTransition}
          setOpenDeleteDialog={setOpenDeleteDialog}
        />
      </ResponsiveDialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <CustomButton
            buttonLabel="Actions"
            size={"sm"}
            variant={"outline"}
            className="h-8"
            skeletonClassName="w-[73px] h-8"
            disabled={isLoading}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={handleCopy(
              dataSelected.map((user) => user.id).join("\n") || "",
            )}
          >
            <CopyIcon />
            Copy id(s)
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleRevokeUserSessions}
            variant="warning"
          >
            <ShieldBanIcon />
            Revoke sessions
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2">
              <RolesIcon size={16} /> Role
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {roles.map((role) => (
                  <DropdownMenuItem
                    key={role}
                    onClick={() => handleChangeUserRole(role)}
                  >
                    <RoleIconComp role={role} />
                    {capitalizeFirstLetter(role)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="danger"
            onClick={() => setOpenBanDialog(true)}
          >
            <BanIcon />
            Ban
          </DropdownMenuItem>

          <DropdownMenuItem variant="warning" onClick={handleUnban}>
            <UnbanIcon />
            Unban
          </DropdownMenuItem>

          <DropdownMenuItem
            variant="destructive"
            onClick={() => setOpenDeleteDialog(true)}
          >
            <TrashIcon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default PaginationActions;
