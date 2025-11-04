"use client";

import { CustomButton } from "@/components/custom-button";
import { BanIcon } from "@/components/icons/ban";
import { ImpersonateIcon } from "@/components/icons/impersonate";
import { RolesIcon } from "@/components/icons/roles";
import { ShieldBanIcon } from "@/components/icons/shield-ban";
import { TrashIcon } from "@/components/icons/trash";
import { UnbanIcon } from "@/components/icons/unban";
import ResponsiveDialog from "@/components/responsive-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MESSAGES } from "@/constants/messages";
import { unbanUser } from "@/core/admin/users/actions/ban-user";
import { impersonateUser } from "@/core/admin/users/actions/impersonate-user";
import { revokeUserSessions } from "@/core/admin/users/actions/revoke-sessions";
import { setUserRole } from "@/core/admin/users/actions/set-user-role";
import DeleteUser from "@/core/admin/users/components/delete-user";
import { BanUserFormSkeleton } from "@/core/admin/users/components/forms/ban-user";
import { RoleIcon } from "@/core/auth/components/role-icon";
import { UserRole } from "@/generated/prisma";
import { useSession } from "@/lib/auth-client";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Session } from "@/types/session";
import { UserProfile } from "@/types/user-profile";
import { useRouter } from "next/navigation";
import { lazy, ReactNode, Suspense, useState, useTransition } from "react";
import { toast } from "sonner";
const BanUserForm = lazy(
  () => import("@/core/admin/users/components/forms/ban-user"),
);

interface Props {
  user: UserProfile;
  session: Session | null;
}

const ProfileActions = ({ user }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [openBanDialog, setOpenBanDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const router = useRouter();
  const { refetch } = useSession();

  const roles = Object.values(UserRole);

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

  return (
    <Card className="@container">
      <CardHeader className="flex flex-col flex-wrap justify-start gap-2">
        <CardTitle className="flex gap-2">Admin</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ProfileAdminRow label={"Impersonate"}>
          <CustomButton
            buttonLabel="Impersonate"
            icon={ImpersonateIcon}
            iconPlacement="left"
            size={"icon"}
            disabled={isPending}
            onClick={handleImpersonate}
            skeletonClassName="w-10"
          />
        </ProfileAdminRow>

        <ProfileAdminRow label={"Revoke sessions"}>
          <CustomButton
            buttonLabel="Revoke sessions"
            icon={ShieldBanIcon}
            iconPlacement="left"
            size={"icon"}
            variant={"warning"}
            disabled={isPending}
            onClick={handleRevokeUserSessions}
            skeletonClassName="w-10"
          />
        </ProfileAdminRow>

        <ProfileAdminRow label={"Set role"}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <CustomButton
                buttonLabel="Revoke sessions"
                icon={RolesIcon}
                iconPlacement="left"
                size={"icon"}
                disabled={isPending}
                skeletonClassName="w-10"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {roles.map((role) => (
                <DropdownMenuItem
                  key={role}
                  onClick={() => handleChangeUserRole(role)}
                  variant={role === user.role ? "info" : "default"}
                >
                  <RoleIcon role={role} />
                  {capitalizeFirstLetter(role)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </ProfileAdminRow>

        <ProfileAdminRow label={user.banned ? "Unban" : "Ban"}>
          {user.banned ? (
            <CustomButton
              buttonLabel="Unban"
              icon={UnbanIcon}
              iconPlacement="left"
              size={"icon"}
              variant={"success"}
              disabled={isPending}
              onClick={handleUnBan}
              skeletonClassName="w-10"
            />
          ) : (
            <ResponsiveDialog
              open={openBanDialog}
              setOpen={setOpenBanDialog}
              trigger={{
                type: "element",
                element: (
                  <CustomButton
                    buttonLabel="Ban"
                    icon={BanIcon}
                    iconPlacement="left"
                    size={"icon"}
                    variant={"danger"}
                    disabled={isPending}
                    onClick={() => setOpenBanDialog(true)}
                    skeletonClassName="w-10"
                  />
                ),
                hidden: false,
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
          )}
        </ProfileAdminRow>

        <ProfileAdminRow label={"Delete"}>
          <ResponsiveDialog
            open={openDeleteDialog}
            setOpen={setOpenDeleteDialog}
            trigger={{
              type: "element",
              element: (
                <CustomButton
                  buttonLabel="Delete"
                  icon={TrashIcon}
                  iconPlacement="left"
                  size={"icon"}
                  variant={"destructive"}
                  disabled={isPending}
                  onClick={() => setOpenDeleteDialog(true)}
                  skeletonClassName="w-10"
                />
              ),
              hidden: false,
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
              setOpenDeleteDialog={(open) => {
                setOpenDeleteDialog(open);
              }}
            />
          </ResponsiveDialog>
        </ProfileAdminRow>
      </CardContent>
    </Card>
  );
};

export default ProfileActions;

function ProfileAdminRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <p>{label}</p>

      {children}
    </div>
  );
}
