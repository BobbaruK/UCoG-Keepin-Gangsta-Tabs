import { AccountIcon } from "@/components/icons/account";
import { AddIcon } from "@/components/icons/add";
import { AdminIcon } from "@/components/icons/admin";
import { AirplayIcon } from "@/components/icons/airplay";
import { AnvilIcon } from "@/components/icons/anvil";
import { ArrowLeftIcon } from "@/components/icons/arrow-left";
import { BanIcon } from "@/components/icons/ban";
import { CalendarIcon } from "@/components/icons/calendar";
import { CameraIcon } from "@/components/icons/camera";
import { CarIcon } from "@/components/icons/car";
import { CastleIcon } from "@/components/icons/castle";
import { ChevronDownIcon } from "@/components/icons/chevron-down";
import { ChevronLeftIcon } from "@/components/icons/chevron-left";
import { ChevronRightIcon } from "@/components/icons/chevron-right";
import { ChevronUpIcon } from "@/components/icons/chevron-up";
import { CogIcon } from "@/components/icons/cog";
import { CopyIcon } from "@/components/icons/copy";
import { DiscordIcon } from "@/components/icons/discord";
import { DrillIcon } from "@/components/icons/drill";
import { EditIcon } from "@/components/icons/edit";
import { EnvelopeIcon } from "@/components/icons/envelope";
import { ErrorIcon } from "@/components/icons/error";
import { FlagIcon } from "@/components/icons/flag";
import { GamepadIcon } from "@/components/icons/gamepad";
import { GithubIcon } from "@/components/icons/github";
import { GogglesIcon } from "@/components/icons/goggles";
import { GoogleIcon } from "@/components/icons/google";
import { HomeIcon } from "@/components/icons/home";
import { ImpersonateIcon } from "@/components/icons/impersonate";
import { KeyIcon } from "@/components/icons/key";
import { LawIcon } from "@/components/icons/law";
import { LinkIcon } from "@/components/icons/link";
import { LoginIcon } from "@/components/icons/login";
import { LogoutIcon } from "@/components/icons/logout";
import { MenuIcon } from "@/components/icons/menu";
import { MinusIcon } from "@/components/icons/minus";
import { MobileIcon } from "@/components/icons/mobile";
import { MonitorIcon } from "@/components/icons/monitor";
import { MoonIcon } from "@/components/icons/moon";
import { MoreIcon } from "@/components/icons/more";
import { OwnerIcon } from "@/components/icons/owner";
import { RolesIcon } from "@/components/icons/roles";
import { ShieldIcon } from "@/components/icons/shield";
import { ShieldBanIcon } from "@/components/icons/shield-ban";
import { SirenIcon } from "@/components/icons/siren";
import { StarIcon } from "@/components/icons/star";
import { TabletIcon } from "@/components/icons/tablet";
import { TerminalIcon } from "@/components/icons/terminal";
import { TraitsIcon } from "@/components/icons/traits";
import { TrashIcon } from "@/components/icons/trash";
import { TVIcon } from "@/components/icons/tv";
import { UnbanIcon } from "@/components/icons/unban";
import { UnlinkIcon } from "@/components/icons/unlink";
import { UserIcon } from "@/components/icons/user";
import { UsersIcon } from "@/components/icons/users";
import { WatchIcon } from "@/components/icons/watch";
import { WormIcon } from "@/components/icons/worm";
import { PageStructure } from "@/components/page-structure";
import { Card, CardContent } from "@/components/ui/card";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Icons",
};

const icons: {
  name: string;
  icon: React.ElementType;
}[] = [
  {
    name: "MoonIcon",
    icon: MoonIcon,
  },
  {
    name: "KeyIcon",
    icon: KeyIcon,
  },
  {
    name: "ShieldIcon",
    icon: ShieldIcon,
  },
  {
    name: "ErrorIcon",
    icon: ErrorIcon,
  },
  {
    name: "AccountIcon",
    icon: AccountIcon,
  },
  {
    name: "EnvelopeIcon",
    icon: EnvelopeIcon,
  },
  {
    name: "TerminalIcon",
    icon: TerminalIcon,
  },
  {
    name: "UserIcon",
    icon: UserIcon,
  },
  {
    name: "LoginIcon",
    icon: LoginIcon,
  },
  {
    name: "LogoutIcon",
    icon: LogoutIcon,
  },
  {
    name: "CogIcon",
    icon: CogIcon,
  },
  {
    name: "GithubIcon",
    icon: GithubIcon,
  },
  {
    name: "GoogleIcon",
    icon: GoogleIcon,
  },
  {
    name: "CalendarIcon",
    icon: CalendarIcon,
  },
  {
    name: "TrashIcon",
    icon: TrashIcon,
  },
  {
    name: "CopyIcon",
    icon: CopyIcon,
  },
  {
    name: "GamepadIcon",
    icon: GamepadIcon,
  },
  {
    name: "MobileIcon",
    icon: MobileIcon,
  },
  {
    name: "TVIcon",
    icon: TVIcon,
  },
  {
    name: "TabletIcon",
    icon: TabletIcon,
  },
  {
    name: "WatchIcon",
    icon: WatchIcon,
  },
  {
    name: "AirplayIcon",
    icon: AirplayIcon,
  },
  {
    name: "GogglesIcon",
    icon: GogglesIcon,
  },
  {
    name: "MonitorIcon",
    icon: MonitorIcon,
  },
  {
    name: "BanIcon",
    icon: BanIcon,
  },
  {
    name: "MoreIcon",
    icon: MoreIcon,
  },
  {
    name: "UsersIcon",
    icon: UsersIcon,
  },
  {
    name: "HomeIcon",
    icon: HomeIcon,
  },
  {
    name: "CameraIcon",
    icon: CameraIcon,
  },
  {
    name: "OwnerIcon",
    icon: OwnerIcon,
  },
  {
    name: "AdminIcon",
    icon: AdminIcon,
  },
  {
    name: "MenuIcon",
    icon: MenuIcon,
  },
  {
    name: "LinkIcon",
    icon: LinkIcon,
  },
  {
    name: "UnlinkIcon",
    icon: UnlinkIcon,
  },
  {
    name: "DiscordIcon",
    icon: DiscordIcon,
  },
  {
    name: "ChevronRightIcon",
    icon: ChevronRightIcon,
  },
  {
    name: "ChevronLeftIcon",
    icon: ChevronLeftIcon,
  },
  {
    name: "ChevronUpIcon",
    icon: ChevronUpIcon,
  },
  {
    name: "ChevronDownIcon",
    icon: ChevronDownIcon,
  },
  {
    name: "ShieldBanIcon",
    icon: ShieldBanIcon,
  },
  {
    name: "UnbanIcon",
    icon: UnbanIcon,
  },
  {
    name: "ImpersonateIcon",
    icon: ImpersonateIcon,
  },
  {
    name: "RolesIcon",
    icon: RolesIcon,
  },
  {
    name: "AddIcon",
    icon: AddIcon,
  },
  {
    name: "EditIcon",
    icon: EditIcon,
  },
  {
    name: "ArrowLeftIcon",
    icon: ArrowLeftIcon,
  },
  {
    name: "WormIcon",
    icon: WormIcon,
  },
  {
    name: "TraitsIcon",
    icon: TraitsIcon,
  },
  {
    name: "LawIcon",
    icon: LawIcon,
  },
  {
    name: "MinusIcon",
    icon: MinusIcon,
  },
  {
    name: "FlagIcon",
    icon: FlagIcon,
  },
  {
    name: "CarIcon",
    icon: CarIcon,
  },
  {
    name: "AnvilIcon",
    icon: AnvilIcon,
  },
  {
    name: "DrillIcon",
    icon: DrillIcon,
  },
  {
    name: "CastleIcon",
    icon: CastleIcon,
  },
  {
    name: "SirenIcon",
    icon: SirenIcon,
  },
  {
    name: "StarIcon",
    icon: StarIcon,
  },
];

const IconsPage = () => {
  return (
    <PageStructure>
      <h1 className="text-3xl font-bold">Icons ({icons.length})</h1>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        {icons
          .sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
          })
          .map((icon) => (
            <Card key={icon.name}>
              <CardContent className="grid place-items-center gap-2">
                {React.createElement(icon.icon, {
                  size: 80,
                  strokeWidth: 1,
                  // absoluteStrokeWidth: true,
                })}

                <p>{icon.name}</p>
              </CardContent>
            </Card>
          ))}
      </div>
    </PageStructure>
  );
};

export default IconsPage;
