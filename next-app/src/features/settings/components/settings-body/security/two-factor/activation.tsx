import { CustomButton } from "@/components/custom-button";
import ResponsiveDialog from "@/components/responsive-dialog";
import { ActivateTwoFASkeleton } from "@/core/auth/components/forms/activation-2fa";
import { useSettingsContext } from "@/features/settings/providers/settings";
import { lazy, Suspense } from "react";
const ActivationTwoFactorForm = lazy(
  () => import("@/core/auth/components/forms/activation-2fa"),
);

const TwoFactorActivation = () => {
  const {
    openActivate2faDialog,
    setOpenActivate2faDialog,
    user,
    startTransition,
    isLoading,
    setBackupCodes,
    setTotpURI,
    setOpenScanQRCodeDialog,
  } = useSettingsContext();

  return (
    <ResponsiveDialog
      open={openActivate2faDialog}
      setOpen={setOpenActivate2faDialog}
      trigger={{
        type: "element",
        element: (
          <CustomButton
            buttonLabel={user?.twoFactorEnabled ? "Disable" : "Enable"}
            variant={"outline"}
            size={"sm"}
          />
        ),
      }}
      header={{
        title: {
          label: `${user?.twoFactorEnabled ? "Deactivate" : "Activate"} 2FA`,
        },
        description: "Enter your password below.",
      }}
    >
      <Suspense fallback={<ActivateTwoFASkeleton />}>
        <ActivationTwoFactorForm
          user={user}
          isLoading={isLoading}
          startTransition={startTransition}
          setTotpURI={setTotpURI}
          setOpenActivate2faDialog={setOpenActivate2faDialog}
          setBackupCodes={setBackupCodes}
          setOpenScanQRCodeDialog={setOpenScanQRCodeDialog}
        />
      </Suspense>
    </ResponsiveDialog>
  );
};

export default TwoFactorActivation;
