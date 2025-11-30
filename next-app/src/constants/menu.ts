import { AutoRouteIcon } from "@/components/icons/auto-route";
import { AutoRouteTypesIcon } from "@/components/icons/auto-route-types";
import { BuildingBackroomIcon } from "@/components/icons/building-backroom";
import { BuildingSizeIcon } from "@/components/icons/building-size";
import { BuildingTypeIcon } from "@/components/icons/building-type";
import { CaptainRoleIcon } from "@/components/icons/captain-role";
import { CrewLevelIcon } from "@/components/icons/crew-level";
import { CrewMemberIcon } from "@/components/icons/crew-member";
import { LawIcon } from "@/components/icons/law";
import { NationalityIcon } from "@/components/icons/nationality";
import { PlaythroughIcon } from "@/components/icons/playthrough";
import { PoliceOfficerIcon } from "@/components/icons/police-officer";
import { ResourceIcon } from "@/components/icons/resource";
import { ResourceTypeIcon } from "@/components/icons/resource-type";
import { SideEffectsIcon } from "@/components/icons/side-effect";
import { TraitsIcon } from "@/components/icons/traits";
import { UsersIcon } from "@/components/icons/users";
import { VehicleTypesIcon } from "@/components/icons/vehicle-types";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import {
  MenuAdminItem,
  MenuItem,
  PlaythroughMenuItem,
} from "@/types/menu-items";
import { TbDashboard } from "react-icons/tb";
import { autoRouteTypesTitle } from "./page-title/auto-route-types";
import { buildingBackroomsTitle } from "./page-title/building-backrooms";
import { buildingSizesTitle } from "./page-title/building-sizes";
import { buildingTypesTitle } from "./page-title/building-types";
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
    icon: PlaythroughIcon,
  },
];

export const menuBasicTables: MenuItem[] = [
  {
    title: buildingTypesTitle.label.plural,
    url: buildingTypesTitle.href,
    icon: BuildingTypeIcon,
  },
  {
    title: buildingSizesTitle.label.plural,
    url: buildingSizesTitle.href,
    icon: BuildingSizeIcon,
  },
  {
    title: buildingBackroomsTitle.label.plural,
    url: buildingBackroomsTitle.href,
    icon: BuildingBackroomIcon,
  },
  {
    title: autoRouteTypesTitle.label.plural,
    url: autoRouteTypesTitle.href,
    icon: AutoRouteTypesIcon,
  },
  {
    title: crewLevelsTitle.label.plural,
    url: crewLevelsTitle.href,
    icon: CrewLevelIcon,
  },
  {
    title: captainRolesTitle.label.plural,
    url: captainRolesTitle.href,
    icon: CaptainRoleIcon,
  },
  {
    title: resourcesTitle.label.plural,
    url: resourcesTitle.href,
    icon: ResourceIcon,
  },
  {
    title: resourceTypesTitle.label.plural,
    url: resourceTypesTitle.href,
    icon: ResourceTypeIcon,
  },
  {
    title: vehicleTypesTitle.label.plural,
    url: vehicleTypesTitle.href,
    icon: VehicleTypesIcon,
  },
  {
    title: nationalitiesTitle.label.plural,
    url: nationalitiesTitle.href,
    icon: NationalityIcon,
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
    icon: SideEffectsIcon,
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
    icon: CrewMemberIcon,
  },
  {
    title: "Auto routes",
    url: `${playthroughTitle.href}/${playthroughId}/auto-routes`,
    icon: AutoRouteIcon,
  },
  {
    title: "Buildings",
    url: `${playthroughTitle.href}/${playthroughId}/buildings`,
    icon: PoliceOfficerIcon,
  },
  {
    title: "Gambling",
    url: `${playthroughTitle.href}/${playthroughId}/gambling`,
    icon: PoliceOfficerIcon,
  },
  {
    title: capitalizeFirstLetter(
      policeOfficersTitle.label.plural.toLowerCase(),
    ),
    url: `${playthroughTitle.href}/${playthroughId + policeOfficersTitle.href}`,
    icon: PoliceOfficerIcon,
  },
  {
    title: "Elections",
    url: `${playthroughTitle.href}/${playthroughId}/elections`,
    icon: PoliceOfficerIcon,
  },
];
