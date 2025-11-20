"use client";

import { ReactNode } from "react";
import { SidebarInset } from "./ui/sidebar";

interface Props {
  header: ReactNode;
  children: ReactNode;
  footer: ReactNode;
}

export const MainWrapper = ({ header, children, footer }: Props) => {
  return (
    <SidebarInset className="contain-inline-size">
      {header}
      {children}
      {footer}
    </SidebarInset>
  );
};
