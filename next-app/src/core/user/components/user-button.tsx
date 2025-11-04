"use client";

import { CustomAvatar } from "@/components/custom-avatar";
import { BanIcon } from "@/components/icons/ban";
import { CogIcon } from "@/components/icons/cog";
import { LoginIcon } from "@/components/icons/login";
import { LogoutIcon } from "@/components/icons/logout";
import { UserIcon } from "@/components/icons/user";
import { UsersIcon } from "@/components/icons/users";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MESSAGES } from "@/constants/messages";
import { stopImpersonatingUser } from "@/core/admin/users/actions/impersonate-user";
import { signOut } from "@/core/auth/actions/sign-out";
import { UserRole } from "@/generated/prisma";
import { useSession } from "@/lib/auth-client";
import { Session } from "@/types/session";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { toast } from "sonner";

interface Props {
  session: Session | null;
}

export const UserButton = ({ session }: Props) => {
  const { setTheme, theme } = useTheme();
  const [theTheme, setTheTheme] = useState(theme);
  const pathname = usePathname();
  const router = useRouter();
  const { refetch } = useSession();

  const user = session?.user;

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
    <DropdownMenu>
      <DropdownMenuTrigger>
        <CustomAvatar image={user?.image || ""} className="cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="">
        {user && (
          <>
            <DropdownMenuLabel>
              {user?.displayUsername || user.name}
            </DropdownMenuLabel>
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
                href={`/profile/${user.slug}`}
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
            <DropdownMenuSeparator />
          </>
        )}
        {session && user?.role !== UserRole.USER && (
          <>
            <DropdownMenuLabel>Admin</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link
                href={"/users"}
                className="flex cursor-pointer items-center justify-start gap-2 p-2"
              >
                <UsersIcon /> Users
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={theTheme} onValueChange={setTheTheme}>
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
        {user ? (
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
  );
};
