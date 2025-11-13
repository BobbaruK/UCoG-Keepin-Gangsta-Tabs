import { AnvilIcon } from "@/components/icons/anvil";
import { CarIcon } from "@/components/icons/car";
import { CastleIcon } from "@/components/icons/castle";
import { DrillIcon } from "@/components/icons/drill";
import { FlagIcon } from "@/components/icons/flag";
import { LawIcon } from "@/components/icons/law";
import { SirenIcon } from "@/components/icons/siren";
import { StarIcon } from "@/components/icons/star";
import { TraitsIcon } from "@/components/icons/traits";
import { UsersIcon } from "@/components/icons/users";
import { WormIcon } from "@/components/icons/worm";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import {
  MenuAdminItem,
  MenuItem,
  PlaythroughMenuItem,
} from "@/types/menu-items";
import { TbDashboard } from "react-icons/tb";
import { captainRolesTitle } from "./page-title/captain-roles";
import { lawsTitle } from "./page-title/laws";
import { nationalitiesTitle } from "./page-title/nationalities";
import { playthroughTitle } from "./page-title/playtrough";
import { policeOfficersTitle } from "./page-title/police-officers";
import { resourceTypesTitle } from "./page-title/resource-types";
import { resourcesTitle } from "./page-title/resources";
import { sideEffectsTitle } from "./page-title/side-effects";
import { traitsTitle } from "./page-title/traits";
import { vehicleTypesTitle } from "./page-title/vehicle-types";
import { crewMembersTitle } from "./page-title/crew-members";
import { CrewIcon } from "@/components/icons/crew";

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
    title: captainRolesTitle.label.plural,
    url: captainRolesTitle.href,
    icon: StarIcon,
  },
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

export const playthroughMenu = (
  playthroughId: string,
): PlaythroughMenuItem[] => [
  {
    title: "Crew members",
    url: `${playthroughTitle.href}/${playthroughId + crewMembersTitle.href}`,
    icon: CrewIcon,
  },
  {
    title: "Auto routes",
    url: `${playthroughTitle.href}/${playthroughId}/auto-routes`,
    icon: SirenIcon,
  },
  {
    title: "Buildings",
    url: `${playthroughTitle.href}/${playthroughId}/buildings`,
    icon: SirenIcon,
  },
  {
    title: "Gambling",
    url: `${playthroughTitle.href}/${playthroughId}/gambling`,
    icon: SirenIcon,
  },
  {
    title: capitalizeFirstLetter(
      policeOfficersTitle.label.plural.toLowerCase(),
    ),
    url: `${playthroughTitle.href}/${playthroughId + policeOfficersTitle.href}`,
    icon: SirenIcon,
  },
  {
    title: "Elections",
    url: `${playthroughTitle.href}/${playthroughId}/elections`,
    icon: SirenIcon,
  },
];
