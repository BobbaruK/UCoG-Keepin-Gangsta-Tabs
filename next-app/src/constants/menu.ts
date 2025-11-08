import { TraitsIcon } from "@/components/icons/traits";
import { UsersIcon } from "@/components/icons/users";
import { WormIcon } from "@/components/icons/worm";
import { MenuAdminItem, MenuItem } from "@/types/menu-items";
import { TbDashboard } from "react-icons/tb";
import { sideEffectsTitle } from "./page-title/side-effects";
import { traitsTitle } from "./page-title/traits";
import { lawsTitle } from "./page-title/laws";
import { LawIcon } from "@/components/icons/law";

export const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: TbDashboard,
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
