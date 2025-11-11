import { IconType } from "react-icons/lib";

export interface MenuItem {
  title: string;
  url: string;
  icon: IconType;
}

export type MenuAdminItem = MenuItem;

export type PlaythroughMenuItem = MenuItem;
