"use client";

import { PlaythroughMenuItem } from "@/types/menu-items";
import { usePathname } from "next/navigation";
import { CustomButton } from "./custom-button";

interface Props {
  menuList: PlaythroughMenuItem[];
}

const CustomTabMenu = ({ menuList }: Props) => {
  const pathname = usePathname();

  return (
    <nav className="bg-muted text-muted-foreground flex h-auto w-full flex-wrap items-center justify-center gap-1 rounded-lg p-[3px] md:grid md:grid-cols-3 lg:grid-cols-6">
      {menuList.map((item) => {
        return (
          <CustomButton
            key={item.url}
            buttonLabel={item.title}
            linkHref={item.url}
            icon={item.icon}
            iconPlacement="left"
            variant={pathname === item.url ? "default" : "link"}
            skeletonClassName="grow h-9"
          />
        );
      })}
    </nav>
  );
};

export default CustomTabMenu;
