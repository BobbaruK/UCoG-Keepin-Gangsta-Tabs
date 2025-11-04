"use client";

import { CustomAvatar } from "@/components/custom-avatar";
import { CalendarIcon } from "@/components/icons/calendar";
import { EnvelopeIcon } from "@/components/icons/envelope";
import { LoginIcon } from "@/components/icons/login";
import { Badge } from "@/components/ui/badge";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { dateFormatter } from "@/lib/utils/format-date";
import Link from "next/link";
import { useSettingsContext } from "../../providers/settings";
import { ChangeAvatar } from "./change-avatar";

export const SettingsHeader = () => {
  const { user } = useSettingsContext();

  const { firstName, image, lastName, meta, role, username } = {
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.displayUsername || user.firstName,
    role: user.role,
    image: user.image,
    meta: {
      email: user.email,
      joined: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      lastLoginMethod: user.lastLoginMethod,
    },
  };

  return (
    <div className="bg-card text-card-foreground flex w-full flex-row flex-wrap items-center gap-6 rounded-xl border p-4 py-6 shadow-sm lg:p-6">
      <div className="relative size-24">
        <CustomAvatar image={image} className="h-full w-full" />
        <ChangeAvatar />
      </div>
      <div className="space-y-2">
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <h1 className="text-2xl font-bold">{username}</h1>
          {role && <Badge variant={"default"}>{role}</Badge>}
        </div>
        <p className="text-muted-foreground">
          {lastName} {firstName}
        </p>
        {meta && (
          <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
            {meta.email && (
              <div className="flex items-center gap-1">
                <EnvelopeIcon size={16} />
                <Link href={`mailto:${meta.email}`}>{meta.email}</Link>
              </div>
            )}

            {meta.joined && (
              <div className="flex items-center gap-1">
                <CalendarIcon size={16} />
                Joined{" "}
                {dateFormatter({
                  date: meta.joined,
                  options: {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  },
                })}
              </div>
            )}
            <div className="flex items-center gap-1">
              <LoginIcon size={16} />
              Last login{" "}
              {dateFormatter({
                date: meta.lastLoginAt,
                options: {
                  timeZone: "Europe/Bucharest",
                  hourCycle: "h23",
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                },
              })}{" "}
              {meta.lastLoginMethod &&
                `(${capitalizeFirstLetter(meta.lastLoginMethod)})`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
