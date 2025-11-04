"use client";

import { CustomButton } from "@/components/custom-button";
import ResponsiveDialog from "@/components/responsive-dialog";
import { ChangeEmailSkeleton } from "@/core/user/components/form/change-email";
import { useSettingsContext } from "@/features/settings/providers/settings";
import { lazy, Suspense } from "react";
const ChangeEmailForm = lazy(
  () => import("@/core/user/components/form/change-email"),
);

export const ChangeEmail = () => {
  const {
    user,
    openChangeEmailDialog,
    setOpenChangeEmailDialog,
    isLoading,
    startTransition,
  } = useSettingsContext();

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-base font-medium">Change email</p>
        <p className="text-muted-foreground text-sm">{user?.email}</p>
      </div>

      <ResponsiveDialog
        open={openChangeEmailDialog}
        setOpen={setOpenChangeEmailDialog}
        trigger={{
          type: "element",
          element: (
            <CustomButton
              buttonLabel="Change"
              variant="outline"
              onClick={() => setOpenChangeEmailDialog(true)}
            />
          ),
        }}
        header={{
          title: {
            label: "Change your email address",
          },
        }}
      >
        <Suspense fallback={<ChangeEmailSkeleton />}>
          <ChangeEmailForm
            userEmail={user.email}
            isLoading={isLoading}
            startTransition={startTransition}
            setOpenChangeEmailDialog={setOpenChangeEmailDialog}
          />
        </Suspense>
      </ResponsiveDialog>
    </div>
  );
};
