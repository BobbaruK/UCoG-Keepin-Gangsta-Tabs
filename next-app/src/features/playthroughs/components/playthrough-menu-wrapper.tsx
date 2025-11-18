"use client";

import CustomTabMenu from "@/components/custom-tab-menu";
import { playthroughMenu } from "@/constants/menu";

interface Props {
  playthroughId: string;
}

const PlaythroughMenu = ({ playthroughId }: Props) => {
  return <CustomTabMenu menuList={playthroughMenu(playthroughId)} />;
};

export default PlaythroughMenu;
