"use client";

import { Playthrough } from "@/core/db/playthrough/types/playthrough";
import { cog_law } from "@/generated/prisma";
import dynamic from "next/dynamic";
import { EditPlaythroughFormSkeleton } from "./form/edit";
const EditPlaythroughForm = dynamic(() => import("./form/edit"), {
  ssr: false,
  loading: () => <EditPlaythroughFormSkeleton />,
});

interface Props {
  playthrough: Playthrough;
  laws: cog_law[] | undefined;
}

const EditPlaythroughFormWrapper = ({ playthrough, laws = [] }: Props) => {
  return <EditPlaythroughForm playthrough={playthrough} laws={laws} />;
};

export default EditPlaythroughFormWrapper;
