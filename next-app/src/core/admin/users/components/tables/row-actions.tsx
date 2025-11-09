"use client";

import { CustomButton } from "@/components/custom-button";
import { AccountIcon } from "@/components/icons/account";
import { BanIcon } from "@/components/icons/ban";
import { CopyIcon } from "@/components/icons/copy";
import { ImpersonateIcon } from "@/components/icons/impersonate";
import { MoreIcon } from "@/components/icons/more";
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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MESSAGES } from "@/constants/messages";
import { unbanUser } from "@/core/admin/users/actions/ban-user";
import { impersonateUser } from "@/core/admin/users/actions/impersonate-user";
import { revokeUserSessions } from "@/core/admin/users/actions/revoke-sessions";
import { setUserRole } from "@/core/admin/users/actions/set-user-role";
import DeleteUser from "@/core/admin/users/components/delete-user";
import { BanUserFormSkeleton } from "@/core/admin/users/components/forms/ban-user";
import { UserRole } from "@/generated/prisma";
import { useCustomCopyToClipboard } from "@/hooks/use-custom-copy-to-clipboard";
import { useSession } from "@/lib/auth-client";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { UserSession } from "@/types/session";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { lazy, Suspense, useState, useTransition } from "react";
import { toast } from "sonner";
const BanUserForm = lazy(
  () => import("@/core/admin/users/components/forms/ban-user"),
);

interface Props {
  user: UserSession;
}

const RowActions = ({ user }: Props) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { refetch } = useSession();
  const { handleCopy } = useCustomCopyToClipboard();
  const [openBanDialog, setOpenBanDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userRoleState, setUserRoleState] = useState(user.role as string);

  const roles = Object.values(UserRole);

  const handleUnBan = () => {
    startTransition(async () => {
      unbanUser(user)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          }

          if (data.success) {
            toast.success(data.success);
          }
        })
        .catch(() => {
          toast.error(MESSAGES.SOMETHING_WRONG);
        });
    });
  };

  const handleRevokeUserSessions = () => {
    startTransition(async () => {
      revokeUserSessions(user)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          }

          if (data.success) {
            toast.success(data.success);
          }
        })
        .catch(() => {
          toast.error(MESSAGES.SOMETHING_WRONG);
        });
    });
  };

  const handleImpersonate = () => {
    startTransition(async () => {
      impersonateUser(user)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          }

          if (data.success) {
            toast.success(data.success);
            router.push("/");
            router.refresh();
            refetch();
          }
        })
        .catch(() => {
          toast.error(MESSAGES.SOMETHING_WRONG);
        });
    });
  };

  const handleChangeUserRole = (newRole: UserRole) => {
    startTransition(async () => {
      setUserRole({ user, role: newRole })
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          }

          if (data.success) {
            toast.success(data.success);
          }
        })
        .catch(() => {
          toast.error(MESSAGES.SOMETHING_WRONG);
        });
    });
  };

  return (
    <>
      <ResponsiveDialog
        open={openBanDialog}
        setOpen={setOpenBanDialog}
        trigger={{
          type: "label",
          label: "",
          hidden: true,
        }}
        header={{
          title: {
            label: "Ban user",
          },
        }}
      >
        <Suspense fallback={<BanUserFormSkeleton />}>
          <BanUserForm
            users={[user]}
            isLoading={isPending}
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
              disabled={isPending}
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
          users={[user]}
          isLoading={isPending}
          startTransition={startTransition}
          setOpenDeleteDialog={setOpenDeleteDialog}
        />
      </ResponsiveDialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={isPending}>
          <CustomButton
            buttonLabel="More"
            size={"icon"}
            icon={MoreIcon}
            iconPlacement="left"
            variant={"outline"}
            className="size-8"
            skeletonClassName="size-8"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleCopy(user.id)}>
            <CopyIcon /> Copy ID
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/profile/${user.slug}`}>
              <AccountIcon />
              Go to profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleImpersonate}>
            <ImpersonateIcon />
            Impersonate
          </DropdownMenuItem>

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
                <DropdownMenuRadioGroup
                  value={userRoleState}
                  onValueChange={setUserRoleState}
                >
                  {roles.map((role) => (
                    <DropdownMenuRadioItem
                      key={role}
                      value={role}
                      onClick={() => handleChangeUserRole(role)}
                    >
                      {capitalizeFirstLetter(role)}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          {user.banned ? (
            <DropdownMenuItem
              onClick={handleUnBan}
              variant="warning"
              // className="text-warning-foreground bg-warning"
            >
              <UnbanIcon />
              Unban
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => setOpenBanDialog(true)}
              variant="danger"
            >
              <BanIcon />
              Ban
            </DropdownMenuItem>
          )}

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

export default RowActions;
