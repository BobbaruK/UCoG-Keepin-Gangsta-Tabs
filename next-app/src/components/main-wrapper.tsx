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
    <SidebarInset>
      {header}
      <main>{children}</main>
      {footer}
    </SidebarInset>
  );
};
