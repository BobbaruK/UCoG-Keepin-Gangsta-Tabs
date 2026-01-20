import { AccountIcon } from "@/components/icons/account";
import { AddIcon } from "@/components/icons/add";
import { AdminIcon } from "@/components/icons/admin";
import { AirplayIcon } from "@/components/icons/airplay";
import { ArrowLeftIcon } from "@/components/icons/arrow-left";
import { AutoRouteIcon } from "@/components/icons/auto-route";
import { AutoRouteTypesIcon } from "@/components/icons/auto-route-types";
import { BanIcon } from "@/components/icons/ban";
import { BossIcon } from "@/components/icons/boss";
import { BuildingIcon } from "@/components/icons/building";
import { BuildingBackroomIcon } from "@/components/icons/building-backroom";
import { BuildingPassiveIcon } from "@/components/icons/building-passive";
import { BuildingPassiveDurationIcon } from "@/components/icons/building-passive-duration";
import { BuildingSizeIcon } from "@/components/icons/building-size";
import { BuildingTypeIcon } from "@/components/icons/building-type";
import { CalendarIcon } from "@/components/icons/calendar";
import { CameraIcon } from "@/components/icons/camera";
import { CapacityCalculatorIcon } from "@/components/icons/capacity-calculator";
import { CaptainRoleIcon } from "@/components/icons/captain-role";
import { ChevronDownIcon } from "@/components/icons/chevron-down";
import { ChevronLeftIcon } from "@/components/icons/chevron-left";
import { ChevronRightIcon } from "@/components/icons/chevron-right";
import { ChevronUpIcon } from "@/components/icons/chevron-up";
import { CogIcon } from "@/components/icons/cog";
import { CopyIcon } from "@/components/icons/copy";
import { CrewLevelIcon } from "@/components/icons/crew-level";
import { CrewMemberIcon } from "@/components/icons/crew-member";
import { DiscordIcon } from "@/components/icons/discord";
import { EditIcon } from "@/components/icons/edit";
import { EnvelopeIcon } from "@/components/icons/envelope";
import { ErrorIcon } from "@/components/icons/error";
import { GamblingBuildingIcon } from "@/components/icons/gambling-building";
import { GamblingFeatureIcon } from "@/components/icons/gambling-feature";
import { GamblingSizeIcon } from "@/components/icons/gambling-size";
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
import { NationalityIcon } from "@/components/icons/nationality";
import { OwnerIcon } from "@/components/icons/owner";
import { PlaythroughIcon } from "@/components/icons/playthrough";
import { PoliceOfficerIcon } from "@/components/icons/police-officer";
import { ResourceIcon } from "@/components/icons/resource";
import { ResourceTypeIcon } from "@/components/icons/resource-type";
import { RolesIcon } from "@/components/icons/roles";
import { ShieldIcon } from "@/components/icons/shield";
import { ShieldBanIcon } from "@/components/icons/shield-ban";
import { SideEffectsIcon } from "@/components/icons/side-effect";
import { SkullIcon } from "@/components/icons/skull";
import { TabletIcon } from "@/components/icons/tablet";
import { TerminalIcon } from "@/components/icons/terminal";
import { TraitsIcon } from "@/components/icons/traits";
import { TrashIcon } from "@/components/icons/trash";
import { TVIcon } from "@/components/icons/tv";
import { UnbanIcon } from "@/components/icons/unban";
import { UnlinkIcon } from "@/components/icons/unlink";
import { UserIcon } from "@/components/icons/user";
import { UsersIcon } from "@/components/icons/users";
import { VehicleIcon } from "@/components/icons/vehicle";
import { VehicleTypesIcon } from "@/components/icons/vehicle-types";
import { WatchIcon } from "@/components/icons/watch";
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
    name: "SideEffectsIcon",
    icon: SideEffectsIcon,
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
    name: "NationalityIcon",
    icon: NationalityIcon,
  },
  {
    name: "VehicleTypesIcon",
    icon: VehicleTypesIcon,
  },
  {
    name: "ResourceTypeIcon",
    icon: ResourceTypeIcon,
  },
  {
    name: "ResourceIcon",
    icon: ResourceIcon,
  },
  {
    name: "PlaythroughIcon",
    icon: PlaythroughIcon,
  },
  {
    name: "PoliceOfficerIcon",
    icon: PoliceOfficerIcon,
  },
  {
    name: "CaptainRoleIcon",
    icon: CaptainRoleIcon,
  },
  {
    name: "CrewMemberIcon",
    icon: CrewMemberIcon,
  },
  {
    name: "BossIcon",
    icon: BossIcon,
  },
  {
    name: "SkullIcon",
    icon: SkullIcon,
  },
  {
    name: "CrewLevelIcon",
    icon: CrewLevelIcon,
  },
  {
    name: "AutoRouteTypesIcon",
    icon: AutoRouteTypesIcon,
  },
  {
    name: "AutoRouteIcon",
    icon: AutoRouteIcon,
  },
  {
    name: "BuildingTypeIcon",
    icon: BuildingTypeIcon,
  },
  {
    name: "BuildingBackroomIcon",
    icon: BuildingBackroomIcon,
  },
  {
    name: "BuildingSizeIcon",
    icon: BuildingSizeIcon,
  },
  {
    name: "BuildingPassiveDurationIcon",
    icon: BuildingPassiveDurationIcon,
  },
  {
    name: "BuildingPassiveIcon",
    icon: BuildingPassiveIcon,
  },
  {
    name: "BuildingIcon",
    icon: BuildingIcon,
  },
  {
    name: "GamblingSizeIcon",
    icon: GamblingSizeIcon,
  },
  {
    name: "GamblingFeatureIcon",
    icon: GamblingFeatureIcon,
  },
  {
    name: "GamblingBuildingIcon",
    icon: GamblingBuildingIcon,
  },
  {
    name: "CapacityCalculatorIcon",
    icon: CapacityCalculatorIcon,
  },
  {
    name: "VehicleIcon",
    icon: VehicleIcon,
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
