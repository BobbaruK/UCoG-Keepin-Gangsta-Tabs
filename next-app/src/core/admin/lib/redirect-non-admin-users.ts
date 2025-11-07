import { UserRole } from "@/generated/prisma";
import { Session } from "@/types/session";
import { redirect } from "next/navigation";

export const redirectNonAdminUsers = ({
  to,
  session,
}: {
  to: string;
  session: Session | null;
}) => {
  if (!session) redirect(to);

  if (session.user.role === UserRole.USER) redirect(to);
};
