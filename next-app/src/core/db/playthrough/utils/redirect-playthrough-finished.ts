import { redirect } from "next/navigation";

export const redirectPlaythroughFinished = ({
  isFinished,
  to,
}: {
  isFinished: boolean;
  to: string;
}) => {
  if (isFinished) redirect(to);
};
