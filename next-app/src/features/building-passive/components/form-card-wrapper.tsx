"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BuildingPassive } from "@/core/cog/building-passive/types/building-passive-duration";
import { Resource } from "@/core/cog/resource/types/resource";
import dynamic from "next/dynamic";
import { AddBuildingPassiveFormSkeleton } from "./form/add";
import { EditBuildingPassiveFormSkeleton } from "./form/edit";
const AddBuildingPassiveForm = dynamic(() => import("./form/add"), {
  ssr: false,
  loading: () => <AddBuildingPassiveFormSkeleton />,
});
const EditBuildingPassiveDurationForm = dynamic(() => import("./form/edit"), {
  ssr: false,
  loading: () => <EditBuildingPassiveFormSkeleton />,
});

type Props = {
  data: (
    | {
        type: "add";
      }
    | {
        type: "edit";
        passive: BuildingPassive;
      }
  ) & {
    resources?: Resource[];
  };
};

const FormCardWrapper = ({ data }: Props) => {
  return (
    <Card>
      <CardContent>
        {data.type === "add" && (
          <AddBuildingPassiveForm resources={data.resources} />
        )}
        {data.type === "edit" && (
          <EditBuildingPassiveDurationForm
            resources={data.resources}
            buildingPassive={data.passive}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default FormCardWrapper;
