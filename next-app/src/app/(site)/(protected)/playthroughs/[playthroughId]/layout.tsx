import { playthroughTitle } from "@/constants/page-title/playthrough";
import { getPlaythrough } from "@/features/playthroughs/data/get";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  params: Promise<{
    playthroughId: string;
  }>;
}

export default async function PlaythroughLayout({ children, params }: Props) {
  const { playthroughId } = await params;

  const dataSession = await auth.api.getSession({
    headers: await headers(),
  });

  const playthrough = await getPlaythrough(playthroughId);

  if (
    !playthrough?.is_public &&
    playthrough?.auth_userId !== dataSession?.user.id
  )
    redirect(playthroughTitle.href);

  return children;
}
