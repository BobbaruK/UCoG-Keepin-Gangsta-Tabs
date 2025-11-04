"use client";

import { Badge } from "@/components/ui/badge";
import { useSettingsContext } from "@/features/settings/providers/settings";
import TwoFactorActivation from "./activation";
import TwoFactorBackupCodes from "./backup-codes";
import TwoFactorScanQR from "./scan-qr";

export const TwoFactor = () => {
  const { user } = useSettingsContext();
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-base font-medium">Two-Factor Authentication</p>
        <p className="text-muted-foreground text-sm">
          Add an extra layer of security to your account
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={user?.twoFactorEnabled ? "success" : "warning"}>
          {user?.twoFactorEnabled ? "Enabled" : "Disabled"}
        </Badge>

        <TwoFactorActivation />

        <TwoFactorScanQR />

        <TwoFactorBackupCodes />
      </div>
    </div>
  );
};
