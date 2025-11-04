"use client";

import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { MESSAGES } from "@/constants/messages";
import { useSettingsContext } from "@/features/settings/providers/settings";
import { updateUser } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";

export const AccountVisibility = () => {
  const { user, isLoading, startTransition } = useSettingsContext();
  const [isChecked, setIsChecked] = useState(user?.isAccountVisible || false);

  const handleCheck = () => {
    startTransition(async () => {
      await updateUser({
        isAccountVisible: !isChecked,
      })
        .then(({ data, error }) => {
          if (data?.status) {
            setIsChecked(!isChecked);
          }

          if (error) {
            toast.error(error.message);
          }
        })
        .catch(() => {
          toast.error(MESSAGES.SOMETHING_WRONG);
        });
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-base font-medium">Account Visibility</p>
        <p className="text-muted-foreground text-sm">
          Make your profile visible to other users
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={!isChecked ? "danger" : "success"}>
          {!isChecked ? "Private" : "Visible"}
        </Badge>
        <Switch
          id="account-switch"
          className="cursor-pointer"
          checked={isChecked}
          onCheckedChange={handleCheck}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};
