"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BuildingType } from "@/core/cog/building-type/types/building-type";
import dynamic from "next/dynamic";
import { AddBuildingTypeFormSkeleton } from "./form/add";
import { EditBuildingTypeFormSkeleton } from "./form/edit";
const AddBuildingTypeForm = dynamic(() => import("./form/add"), {
  ssr: false,
  loading: () => <AddBuildingTypeFormSkeleton />,
});
const EditBuildingTypeForm = dynamic(() => import("./form/edit"), {
  ssr: false,
  loading: () => <EditBuildingTypeFormSkeleton />,
});

type Props = {
  data:
    | {
        type: "add";
      }
    | {
        type: "edit";
        building: BuildingType;
      };
};

const FormCardWrapper = ({ data }: Props) => {
  return (
    <Card>
      <CardContent>
        {data.type === "add" && <AddBuildingTypeForm />}
        {data.type === "edit" && (
          <EditBuildingTypeForm buildingType={data.building} />
        )}
      </CardContent>
    </Card>
  );
};

export default FormCardWrapper;
