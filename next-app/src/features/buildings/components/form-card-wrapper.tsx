"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BuildingBackroom } from "@/core/cog/building-backroom/types/building-backroom";
import { BuildingPassiveDuration } from "@/core/cog/building-passive-duration/types/building-passive-duration";
import { BuildingPassive } from "@/core/cog/building-passive/types/building-passive-duration";
import { BuildingSize } from "@/core/cog/building-size/types/building-size";
import { BuildingType } from "@/core/cog/building-type/types/building-type";
import { Building } from "@/core/cog/building/types/building";
import { CrewMember } from "@/core/cog/crew-member/types/crew-member";
import { Playthrough } from "@/core/cog/playthrough/types/playthrough";
import dynamic from "next/dynamic";
import { AddBuildingFormSkeleton } from "./form/add";
import { EditBuildingFormSkeleton } from "./form/edit";
const AddBuildingForm = dynamic(() => import("./form/add"), {
  ssr: false,
  loading: () => <AddBuildingFormSkeleton />,
});
const EditBuildingForm = dynamic(() => import("./form/edit"), {
  ssr: false,
  loading: () => <EditBuildingFormSkeleton />,
});

type Props = {
  data: (
    | {
        type: "add";
        playthrough: Playthrough;
      }
    | {
        type: "edit";
        building: Building;
      }
  ) & {
    buildingSizes: BuildingSize[] | undefined;
    buildingTypes: BuildingType[] | undefined;
    buildingBackrooms: BuildingBackroom[] | undefined;
    crewMembers: CrewMember[] | undefined;
    passiveProductions: BuildingPassive[] | undefined;
    productionDurations: BuildingPassiveDuration[] | undefined;
  };
};

const FormCardWrapper = ({ data }: Props) => {
  return (
    <Card>
      <CardContent>
        {data.type === "add" && (
          <AddBuildingForm
            playthrough={data.playthrough}
            buildingSizes={data.buildingSizes}
            buildingTypes={data.buildingTypes}
            buildingBackrooms={data.buildingBackrooms}
            crewMembers={data.crewMembers}
            passiveProductions={data.passiveProductions}
            passiveDurations={data.productionDurations}
          />
        )}
        {data.type === "edit" && (
          <EditBuildingForm
            building={data.building}
            buildingSizes={data.buildingSizes}
            buildingTypes={data.buildingTypes}
            buildingBackrooms={data.buildingBackrooms}
            crewMembers={data.crewMembers}
            passiveProductions={data.passiveProductions}
            passiveDurations={data.productionDurations}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default FormCardWrapper;
