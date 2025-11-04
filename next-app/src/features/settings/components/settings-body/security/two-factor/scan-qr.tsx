import { CustomButton } from "@/components/custom-button";
import ResponsiveDialog from "@/components/responsive-dialog";
import { MESSAGES } from "@/constants/messages";
import { TwoFactorScanQRSkeleton } from "@/core/auth/components/forms/otp-verification";
import { useSettingsContext } from "@/features/settings/providers/settings";
import { lazy, Suspense } from "react";
const OTPVerificationForm = lazy(
  () => import("@/core/auth/components/forms/otp-verification"),
);

const TwoFactorScanQR = () => {
  const {
    totpURI,
    openScanQRCodeDialog,
    setOpenScanQRCodeDialog,
    setOpenBackupCodesDialog,
  } = useSettingsContext();

  return (
    <ResponsiveDialog
      open={openScanQRCodeDialog}
      setOpen={setOpenScanQRCodeDialog}
      trigger={{
        type: "element",
        hidden: true,
        element: (
          <CustomButton
            buttonLabel={"Get the codes"}
            variant={"outline"}
            size={"sm"}
          />
        ),
      }}
      header={{
        title: {
          label: `2FA Verification`,
        },
        description: MESSAGES.QR_SCAN,
      }}
    >
      <Suspense fallback={<TwoFactorScanQRSkeleton />}>
        <OTPVerificationForm
          otpLink={totpURI}
          isFirstTime
          setOpenScanQRCodeDialog={setOpenScanQRCodeDialog}
          setOpenBackupCodesDialog={setOpenBackupCodesDialog}
        />
      </Suspense>
    </ResponsiveDialog>
  );
};

export default TwoFactorScanQR;
