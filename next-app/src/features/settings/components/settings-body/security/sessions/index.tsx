"use client";

import { CustomButton } from "@/components/custom-button";
import { ShieldIcon } from "@/components/icons/shield";
import ResponsiveDialog from "@/components/responsive-dialog";
import { useSettingsContext } from "@/features/settings/providers/settings";
import { lazy, Suspense } from "react";
import { SessionFallback } from "./sessions-table";
const SessionsTable = lazy(() => import("./sessions-table"));

export const Sessions = () => {
  const { openSessionsDialog, setOpenSessionsDialog } = useSettingsContext();

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-base font-medium">Active Sessions</p>
        <p className="text-muted-foreground text-sm">
          Manage devices that are logged into your account
        </p>
      </div>

      <ResponsiveDialog
        open={openSessionsDialog}
        setOpen={setOpenSessionsDialog}
        trigger={{
          type: "element",
          element: (
            <CustomButton
              buttonLabel={"View Sessions"}
              variant={"outline"}
              size={"sm"}
              icon={ShieldIcon}
              iconPlacement="left"
              hideLabelOnMobile={false}
            />
          ),
        }}
        header={{
          title: {
            label: `Your sessions`,
          },
        }}
      >
        <Suspense fallback={<SessionFallback />}>
          <SessionsTable setOpenSessionsDialog={setOpenSessionsDialog} />
        </Suspense>
      </ResponsiveDialog>
    </div>
  );
};
