import { AppSidebar } from "@/components/app-sidebar";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MainWrapper } from "@/components/main-wrapper";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { APP_NAME } from "@/constants/misc";
import { DEFAULT_LOGIN_REDIRECT } from "@/constants/routes";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: { default: "Admin", template: `%s | Admin ${APP_NAME}` },
  description: "Admin area",
};

interface Props {
  children: ReactNode;
}

export default async function ProtectedLayout({ children }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  if (session.user.role === UserRole.USER) redirect(DEFAULT_LOGIN_REDIRECT);

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />

      <MainWrapper header={<Header />} footer={<Footer />}>
        <SidebarTrigger />
        {children}
      </MainWrapper>
    </SidebarProvider>
  );
}
