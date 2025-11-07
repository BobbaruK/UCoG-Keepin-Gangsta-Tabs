"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { useSidebar } from "./ui/sidebar";
import { Separator } from "./ui/separator";

interface Props {
  header: ReactNode;
  children: ReactNode;
  footer: ReactNode;
}

export const MainWrapper = ({ header, children, footer }: Props) => {
  const { isMobile, state } = useSidebar();

  return (
    // TODO: this shit make cls on mobile
    <div
      className={cn("flex w-full flex-col transition-[width] duration-200", {
        "w-full": isMobile,
        "w-[calc(100%-var(--sidebar-width))]":
          !isMobile && state === "expanded",
        "w-[calc(100%-var(--sidebar-width-icon))]":
          !isMobile && state === "collapsed",
      })}
    >
      {header}
      <main>{children}</main>
      {footer}
    </div>
  );
};
