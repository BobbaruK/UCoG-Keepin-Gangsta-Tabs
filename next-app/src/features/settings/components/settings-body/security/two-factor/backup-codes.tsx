"use client";

import { CustomButton } from "@/components/custom-button";
import { CopyIcon } from "@/components/icons/copy";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { useSettingsContext } from "@/features/settings/providers/settings";
import { useCustomCopyToClipboard } from "@/hooks/use-custom-copy-to-clipboard";

const TwoFactorBackupCodes = () => {
  const { backupCodes, openBackupCodesDialog, setOpenBackupCodesDialog } =
    useSettingsContext();
  const { handleCopy } = useCustomCopyToClipboard();

  return (
    <AlertDialog
      open={openBackupCodesDialog}
      onOpenChange={setOpenBackupCodesDialog}
    >
      <AlertDialogTrigger asChild hidden>
        <CustomButton buttonLabel="Show codes" className="mt-4 w-full" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Copy backup codes</AlertDialogTitle>
          <AlertDialogDescription>
            Please make sure you have stored the backup codes in a safe place.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 text-center">
            {backupCodes.map((code) => (
              <div key={code}>{code}</div>
            ))}
          </div>
        </div>
        <AlertDialogFooter>
          {/* <AlertDialogCancel>Cancel</AlertDialogCancel> */}

          <AlertDialogAction
            className={buttonVariants({ variant: "success" })}
            asChild
          >
            <CustomButton
              buttonLabel="Copy backup codes to clipboard"
              icon={CopyIcon}
              iconPlacement="left"
              hideLabelOnMobile={false}
              variant={"warning"}
              onClick={handleCopy(backupCodes.join("\n"))}
            />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TwoFactorBackupCodes;
