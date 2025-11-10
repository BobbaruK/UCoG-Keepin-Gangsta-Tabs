import { AnvilIcon } from "@/components/icons/anvil";
import { CarIcon } from "@/components/icons/car";
import { CastleIcon } from "@/components/icons/castle";
import { DrillIcon } from "@/components/icons/drill";
import { FlagIcon } from "@/components/icons/flag";
import { LawIcon } from "@/components/icons/law";
import { TraitsIcon } from "@/components/icons/traits";
import { UsersIcon } from "@/components/icons/users";
import { WormIcon } from "@/components/icons/worm";
import { MenuAdminItem, MenuItem } from "@/types/menu-items";
import { TbDashboard } from "react-icons/tb";
import { lawsTitle } from "./page-title/laws";
import { nationalitiesTitle } from "./page-title/nationalities";
import { playthroughTitle } from "./page-title/playtrough";
import { resourceTypesTitle } from "./page-title/resource-types";
import { resourcesTitle } from "./page-title/resources";
import { sideEffectsTitle } from "./page-title/side-effects";
import { traitsTitle } from "./page-title/traits";
import { vehicleTypesTitle } from "./page-title/vehicle-types";

export const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: TbDashboard,
  },
  {
    title: playthroughTitle.label.plural,
    url: playthroughTitle.href,
    icon: CastleIcon,
  },
];

export const menuBasicTables: MenuItem[] = [
  {
    title: resourcesTitle.label.plural,
    url: resourcesTitle.href,
    icon: DrillIcon,
  },
  {
    title: resourceTypesTitle.label.plural,
    url: resourceTypesTitle.href,
    icon: AnvilIcon,
  },
  {
    title: vehicleTypesTitle.label.plural,
    url: vehicleTypesTitle.href,
    icon: CarIcon,
  },
  {
    title: nationalitiesTitle.label.plural,
    url: nationalitiesTitle.href,
    icon: FlagIcon,
  },
  {
    title: lawsTitle.label.plural,
    url: lawsTitle.href,
    icon: LawIcon,
  },
  {
    title: traitsTitle.label.plural,
    url: traitsTitle.href,
    icon: TraitsIcon,
  },
  {
    title: sideEffectsTitle.label.plural,
    url: sideEffectsTitle.href,
    icon: WormIcon,
  },
];

export const menuAdminItems: MenuAdminItem[] = [
  {
    title: "Users",
    url: "/users",
    icon: UsersIcon,
  },
];
