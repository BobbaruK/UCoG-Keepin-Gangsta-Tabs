"use client";

import { CustomButton } from "@/components/custom-button";
import { AirplayIcon } from "@/components/icons/airplay";
import { GamepadIcon } from "@/components/icons/gamepad";
import { GogglesIcon } from "@/components/icons/goggles";
import { MobileIcon } from "@/components/icons/mobile";
import { MonitorIcon } from "@/components/icons/monitor";
import { TabletIcon } from "@/components/icons/tablet";
import { TVIcon } from "@/components/icons/tv";
import { WatchIcon } from "@/components/icons/watch";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { MESSAGES } from "@/constants/messages";
import {
  revokeOtherSeshs,
  revokeSelectedSesh,
  revokeSeshs,
} from "@/core/user/actions/sessions";
import { getSessions } from "@/core/user/data/get-sessions";
import { useSettingsContext } from "@/features/settings/providers/settings";
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { dateFormatter } from "@/lib/utils/format-date";
import { Session, SessionObj } from "@/types/session";
import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useState, useTransition } from "react";
import { toast } from "sonner";
import { UAParser } from "ua-parser-js";

interface Props extends React.BaseHTMLAttributes<HTMLDivElement> {
  setOpenSessionsDialog: (open: boolean) => void;
}

const SessionsTable = ({ setOpenSessionsDialog, ...restProps }: Props) => {
  const [sessions, setSessions] = useState<SessionObj[] | null>(null);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const { isLoading, startTransition: startProviderTransition } =
    useSettingsContext();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const fetchSessions = () =>
    startProviderTransition(
      async () =>
        await getSessions()
          .then((data) => {
            setSessions(data?.sessions || null);
            setActiveSession(data?.currentSession || null);
          })
          .catch(() => {
            toast.error(MESSAGES.SOMETHING_WRONG);
            setOpenSessionsDialog(false);
          }),
    );

  const fetchSessionsOnMounted = useEffectEvent(() => fetchSessions());

  useEffect(() => {
    fetchSessionsOnMounted();
  }, []);

  const revokeSession = (token: string) =>
    startTransition(
      async () =>
        await revokeSelectedSesh(token)
          .then((data) => {
            if (data.error) {
              toast.error(data.error);
            }

            if (data) {
              toast.success(data.success);
              fetchSessions();
            }
          })
          .catch(() => {
            toast.error(MESSAGES.SOMETHING_WRONG);
          }),
    );

  const revokeOtherSessions = async () =>
    startTransition(
      async () =>
        await revokeOtherSeshs()
          .then((data) => {
            if (data.error) {
              toast.error(data.error);
            }

            if (data) {
              toast.success(data.success);
              setOpenSessionsDialog(false);
            }
          })
          .catch(() => {
            toast.error(MESSAGES.SOMETHING_WRONG);
          }),
    );

  const revokeAllSessions = async () =>
    startTransition(
      async () =>
        await revokeSeshs()
          .then(async (data) => {
            if (data.error) {
              toast.error(data.error);
            }

            if (data) {
              setOpenSessionsDialog(false);
              toast.success(data.success);

              await signOut().then(() => {
                router.push("/login");
                toast.success(MESSAGES.LOGOUT_SUCCESS);
              });
            }
          })
          .catch(() => {
            toast.error(MESSAGES.SOMETHING_WRONG);
          }),
    );

  return (
    <div className={cn("flex flex-col gap-6", restProps.className)}>
      <ScrollArea className="h-80 w-full rounded-lg border">
        <div className="flex flex-col gap-4 py-2 ps-2 pe-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((skeleton, index) => (
              <Skeleton key={index} className="h-[172px] w-[353px]" />
            ))
          ) : (
            <>
              {sessions?.map((session) => {
                const { browser, os, device } = UAParser(
                  session.userAgent || "",
                );
                return (
                  <Card key={session.id}>
                    <CardHeader>
                      <CardTitle className="flex flex-wrap items-center gap-2">
                        <DeviceIcon deviceType={device.type} />

                        <span>{session.ipAddress}</span>

                        {session.id === activeSession?.session.id && (
                          <Badge>Active</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        <strong>{browser.name}</strong> on{" "}
                        <strong>
                          {os.name} {os.version}
                        </strong>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Login on{" "}
                        <strong>
                          {dateFormatter({
                            date: session.createdAt,
                            options: {
                              timeZone: "Europe/Bucharest",
                              hourCycle: "h23",
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          })}
                        </strong>
                      </p>
                      <p>
                        Expires on{" "}
                        <strong>
                          {dateFormatter({
                            date: session.expiresAt,
                            options: {
                              timeZone: "Europe/Bucharest",
                              hourCycle: "h23",
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          })}
                        </strong>
                      </p>
                    </CardContent>
                    {session.id !== activeSession?.session.id && (
                      <CardFooter className="flex items-center justify-end gap-2">
                        <CustomButton
                          buttonLabel="Revoke"
                          variant={"danger"}
                          onClick={() => revokeSession(session.token)}
                          disabled={isPending}
                        />
                      </CardFooter>
                    )}
                  </Card>
                );
              })}
            </>
          )}
        </div>
      </ScrollArea>
      <div className="flex items-center justify-end gap-4">
        <CustomButton
          buttonLabel="Revoke all"
          variant={"danger"}
          onClick={revokeAllSessions}
          disabled={isLoading || isPending}
        />
        <CustomButton
          buttonLabel="Revoke others"
          variant={"danger"}
          onClick={revokeOtherSessions}
          disabled={isLoading || isPending}
        />
      </div>
    </div>
  );
};

export default SessionsTable;

function DeviceIcon({ deviceType }: { deviceType: UAParser.IDevice["type"] }) {
  if (deviceType === "wearable") return <WatchIcon />;
  if (deviceType === "mobile") return <MobileIcon />;
  if (deviceType === "tablet") return <TabletIcon />;
  if (deviceType === "desktop") return <MonitorIcon />;
  if (deviceType === "smarttv") return <TVIcon />;
  if (deviceType === "console") return <GamepadIcon />;

  if (deviceType === "embedded") return <AirplayIcon />;
  if (deviceType === "xr") return <GogglesIcon />;

  return <MonitorIcon />;
}

export function SessionFallback() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-80 w-full" />
      <div className="flex items-center justify-end gap-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}
