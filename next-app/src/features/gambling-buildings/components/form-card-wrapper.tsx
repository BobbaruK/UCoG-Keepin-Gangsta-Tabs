"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CrewMember } from "@/core/cog/crew-member/types/crew-member";
import { GamblingBuilding } from "@/core/cog/gambling-building/types/gambling-building";
import { GamblingFeature } from "@/core/cog/gambling-feature/types/gambling-feature";
import { GamblingSize } from "@/core/cog/gambling-size/types/gambling-size";
import { Playthrough } from "@/core/cog/playthrough/types/playthrough";
import dynamic from "next/dynamic";
import { AddGamblingBuildingFormSkeleton } from "./form/add";
import { EditGamblingBuildingFormSkeleton } from "./form/edit";
const AddGamblingBuildingForm = dynamic(() => import("./form/add"), {
  ssr: false,
  loading: () => <AddGamblingBuildingFormSkeleton />,
});
const EditGamblingBuildingForm = dynamic(() => import("./form/edit"), {
  ssr: false,
  loading: () => <EditGamblingBuildingFormSkeleton />,
});

type Props = {
  data: (
    | {
        type: "add";
        playthrough: Playthrough;
      }
    | {
        type: "edit";
        gamblingBuilding: GamblingBuilding;
      }
  ) & {
    crewMembers: CrewMember[] | undefined;
    gamblingSizes: GamblingSize[] | undefined;
    gamblingFeatures: GamblingFeature[] | undefined;
  };
};

const FormCardWrapper = ({ data }: Props) => {
  return (
    <Card>
      <CardContent>
        {data.type === "add" && (
          <AddGamblingBuildingForm
            playthrough={data.playthrough}
            crewMembers={data.crewMembers}
            gamblingSizes={data.gamblingSizes}
            gamblingFeatures={data.gamblingFeatures}
          />
        )}
        {data.type === "edit" && (
          <EditGamblingBuildingForm
            gamblingBuilding={data.gamblingBuilding}
            crewMembers={data.crewMembers}
            gamblingSizes={data.gamblingSizes}
            gamblingFeatures={data.gamblingFeatures}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default FormCardWrapper;
