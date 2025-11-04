import { AdminIcon } from "@/components/icons/admin";
import { OwnerIcon } from "@/components/icons/owner";
import { UserIcon } from "@/components/icons/user";
import { UserRole } from "@/generated/prisma";
import { LucideIconProps } from "@/types/icons";

type Props = { role: UserRole } & LucideIconProps;

export const RoleIcon = ({ role, ...props }: Props) => {
  switch (role) {
    case UserRole.ADMIN:
      return <AdminIcon {...props} />;

    case UserRole.OWNER:
      return <OwnerIcon {...props} />;

    default:
      return <UserIcon {...props} />;
  }
};
