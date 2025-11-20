import { AppSidebar } from "@/components/app-sidebar";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MainWrapper } from "@/components/main-wrapper";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function PublicLayout({ children }: Props) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />

      <MainWrapper header={<Header />} footer={<Footer />}>
        {children}
      </MainWrapper>
    </SidebarProvider>
  );
}
