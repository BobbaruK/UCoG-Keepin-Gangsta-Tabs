"use client";

import { Nationality } from "@/core/db/nationality/types/nationality";
import { Trait } from "@/core/db/trait/types/trait";
import { cog_law } from "@/generated/prisma";
import dynamic from "next/dynamic";
import { AddPlaythroughFormSkeleton } from "./form/add";
const AddPlaythroughForm = dynamic(() => import("./form/add"), {
  ssr: false,
  loading: () => <AddPlaythroughFormSkeleton />,
});

interface Props {
  laws: cog_law[] | undefined;
  nationalities: Nationality[] | undefined;
  traits: Trait[] | undefined;
}

const AddPlaythroughFormWrapper = ({
  laws = [],
  nationalities = [],
  traits = [],
}: Props) => {
  return (
    <AddPlaythroughForm
      laws={laws}
      nationalities={nationalities}
      traits={traits}
    />
  );
};

export default AddPlaythroughFormWrapper;
