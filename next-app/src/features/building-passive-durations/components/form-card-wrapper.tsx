"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BuildingPassiveDuration } from "@/core/cog/building-passive-duration/types/building-passive-duration";
import dynamic from "next/dynamic";
import { AddBuildingSizeFormSkeleton } from "./form/add";
import { EditBuildingPassiveDurationFormSkeleton } from "./form/edit";
const AddBuildingSizeForm = dynamic(() => import("./form/add"), {
  ssr: false,
  loading: () => <AddBuildingSizeFormSkeleton />,
});
const EditBuildingPassiveDurationForm = dynamic(() => import("./form/edit"), {
  ssr: false,
  loading: () => <EditBuildingPassiveDurationFormSkeleton />,
});

type Props = {
  data:
    | {
        type: "add";
      }
    | {
        type: "edit";
        passiveDuration: BuildingPassiveDuration;
      };
};

const FormCardWrapper = ({ data }: Props) => {
  return (
    <Card>
      <CardContent>
        {data.type === "add" && <AddBuildingSizeForm />}
        {data.type === "edit" && (
          <EditBuildingPassiveDurationForm
            buildingPassiveDuration={data.passiveDuration}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default FormCardWrapper;
