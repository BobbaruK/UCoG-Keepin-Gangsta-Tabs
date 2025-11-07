"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { menuAdminItems, menuItems } from "@/constants/menu";
import { MESSAGES } from "@/constants/messages";
import { stopImpersonatingUser } from "@/core/admin/users/actions/impersonate-user";
import { signOut } from "@/core/auth/actions/sign-out";
import { useSession } from "@/lib/auth-client";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Home,
  Inbox,
  Search,
  Settings,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { CustomAvatar } from "./custom-avatar";
import { BanIcon } from "./icons/ban";
import { CogIcon } from "./icons/cog";
import { LoginIcon } from "./icons/login";
import { LogoutIcon } from "./icons/logout";
import { UserIcon } from "./icons/user";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { UserRole } from "@/generated/prisma";

const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  const { data: session, refetch } = useSession();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const logOut = () => {
    startTransition(async () => {
      signOut()
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          }

          if (data.success) {
            toast.success(data.success);
            router.push("/login");
          }
        })
        .catch(() => {
          toast.error(MESSAGES.SOMETHING_WRONG);
        });
    });
  };

  const stopImpersonating = () => {
    stopImpersonatingUser()
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        }

        if (data.success) {
          toast.success(data.success);
          router.push("/");
          router.refresh();
          refetch();
        }
      })
      .catch(() => {
        toast.error(MESSAGES.SOMETHING_WRONG);
      });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {menuItems && (
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger>
                  City of Gangsters
                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {menuItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname.startsWith(item.url)}
                          tooltip={item.title}
                        >
                          <Link href={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        )}

        {session?.user.role !== UserRole.USER && menuAdminItems && (
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger>
                  Admin
                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {menuAdminItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname.startsWith(item.url)}
                          tooltip={item.title}
                        >
                          <Link href={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-auto">
                  <CustomAvatar
                    image={session?.user.image}
                    className="size-6"
                  />
                  <span className="line-clamp-1">
                    {session?.user.displayUsername || "User"}
                  </span>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="">
                <DropdownMenuLabel>Theme</DropdownMenuLabel>

                <DropdownMenuRadioGroup
                  value={theme}
                  // onValueChange={setTheme}
                >
                  <DropdownMenuRadioItem
                    value="light"
                    onClick={() => setTheme("light")}
                    className="cursor-pointer"
                  >
                    Light
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="dark"
                    onClick={() => setTheme("dark")}
                    className="cursor-pointer"
                  >
                    Dark
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="system"
                    onClick={() => setTheme("system")}
                    className="cursor-pointer"
                  >
                    System
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>

                <DropdownMenuSeparator />

                {session?.user && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link
                        href={"/settings"}
                        className="flex cursor-pointer items-center justify-start gap-2 p-2"
                      >
                        <CogIcon /> Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/profile/${session.user.slug}`}
                        className="flex cursor-pointer items-center justify-start gap-2 p-2"
                      >
                        <UserIcon /> Profile
                      </Link>
                    </DropdownMenuItem>
                    {session.session.impersonatedBy && (
                      <DropdownMenuItem
                        onClick={stopImpersonating}
                        variant="destructive"
                      >
                        <BanIcon /> Stop impersonating
                      </DropdownMenuItem>
                    )}
                  </>
                )}

                {session?.user ? (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="flex cursor-pointer items-center justify-start gap-3 p-2"
                      onClick={logOut}
                      variant="destructive"
                    >
                      <LogoutIcon /> Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        className="flex cursor-pointer items-center justify-start gap-3 p-2"
                        href={"/login"}
                      >
                        <LoginIcon /> Login
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
