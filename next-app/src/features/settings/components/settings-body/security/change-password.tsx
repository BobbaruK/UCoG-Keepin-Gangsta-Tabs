"use client";

import { CustomButton } from "@/components/custom-button";
import { KeyIcon } from "@/components/icons/key";
import ResponsiveDialog from "@/components/responsive-dialog";
import { ChangePasswordSkeleton } from "@/core/user/components/form/change-password";
import { SetPasswordSkeleton } from "@/core/user/components/form/set-password";
import { useSettingsContext } from "@/features/settings/providers/settings";
import { lazy, Suspense } from "react";
const ChangePasswordForm = lazy(
  () => import("@/core/user/components/form/change-password"),
);
const SetPasswordForm = lazy(
  () => import("@/core/user/components/form/set-password"),
);

export const ChangePassword = () => {
  const {
    user,
    openChangePasswordDialog,
    setOpenChangePasswordDialog,
    isLoading,
    startTransition,
  } = useSettingsContext();

  const userProviders = user.accounts.map((provider) => provider.providerId);
  const hasCredential = userProviders.includes("credential");

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-base font-medium">Password</p>
        <p className="text-muted-foreground text-sm">
          Last changed 3 months ago
        </p>
      </div>

      <ResponsiveDialog
        open={openChangePasswordDialog}
        setOpen={setOpenChangePasswordDialog}
        trigger={{
          type: "element",
          element: (
            <CustomButton
              buttonLabel={`${hasCredential ? "Change" : "Set"} Password`}
              variant={"outline"}
              icon={KeyIcon}
              iconPlacement="left"
              hideLabelOnMobile={false}
            />
          ),
        }}
        header={{
          title: {
            label: `${hasCredential ? "Change" : "Set"} your password`,
          },
          description:
            "Password must contain at least one of each: lowercase letters, uppercase letters, numbers and special characters.",
        }}
      >
        {hasCredential ? (
          <Suspense fallback={<ChangePasswordSkeleton />}>
            <ChangePasswordForm
              isLoading={isLoading}
              startTransition={startTransition}
              setOpenChangePasswordDialog={setOpenChangePasswordDialog}
            />
          </Suspense>
        ) : (
          <Suspense fallback={<SetPasswordSkeleton />}>
            <SetPasswordForm
              isLoading={isLoading}
              startTransition={startTransition}
              setOpenChangePasswordDialog={setOpenChangePasswordDialog}
            />
          </Suspense>
        )}
      </ResponsiveDialog>
    </div>
  );
};
