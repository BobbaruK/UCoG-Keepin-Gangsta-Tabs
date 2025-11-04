import { CustomAlert } from "@/components/custom-alert";
import { UserRole } from "@/generated/prisma";
import { useSession } from "@/lib/auth-client";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  allowedRole: UserRole[];
}

export const RoleGate = ({ allowedRole, children }: Props) => {
  const { data: session } = useSession();

  const role = session?.user.role as UserRole;

  if (!allowedRole.includes(role))
    return (
      <CustomAlert
        variant={"danger"}
        title="Forbidden"
        description="You do not have permission to view this content!"
      />
    );

  return <>{children}</>;
};
