import { redirect } from "next/navigation";

export const redirectNonOwnerUsers = ({
  to,
  isOwner,
}: {
  to: string;
  isOwner: boolean;
}) => {
  if (!isOwner) redirect(to);
};
