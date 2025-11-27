import { AnvilIcon } from "@/components/icons/anvil";
import { AutoRouteTypesIcon } from "@/components/icons/auto-route-types";
import { CarIcon } from "@/components/icons/car";
import { CastleIcon } from "@/components/icons/castle";
import { CrewIcon } from "@/components/icons/crew";
import { DrillIcon } from "@/components/icons/drill";
import { FlagIcon } from "@/components/icons/flag";
import { LawIcon } from "@/components/icons/law";
import { LevelIcon } from "@/components/icons/level";
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
import { autoRouteTypesTitle } from "./page-title/auto-route-types";
import { captainRolesTitle } from "./page-title/captain-roles";
import { crewLevelsTitle } from "./page-title/crew-levels";
import { crewMembersTitle } from "./page-title/crew-members";
import { lawsTitle } from "./page-title/laws";
import { nationalitiesTitle } from "./page-title/nationalities";
import { playthroughTitle } from "./page-title/playthrough";
import { policeOfficersTitle } from "./page-title/police-officers";
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
    title: autoRouteTypesTitle.label.plural,
    url: autoRouteTypesTitle.href,
    icon: AutoRouteTypesIcon,
  },
  {
    title: crewLevelsTitle.label.plural,
    url: crewLevelsTitle.href,
    icon: LevelIcon,
  },
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
