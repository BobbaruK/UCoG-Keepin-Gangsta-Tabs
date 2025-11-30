"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BuildingBackroom } from "@/core/cog/building-backroom/types/building-backroom";
import dynamic from "next/dynamic";
import { AddBuildingBackroomFormSkeleton } from "./form/add";
import { EditBuildingBackroomFormSkeleton } from "./form/edit";
const AddBuildingTypeForm = dynamic(() => import("./form/add"), {
  ssr: false,
  loading: () => <AddBuildingBackroomFormSkeleton />,
});
const EditBuildingBackroomForm = dynamic(() => import("./form/edit"), {
  ssr: false,
  loading: () => <EditBuildingBackroomFormSkeleton />,
});

type Props = {
  data:
    | {
        type: "add";
      }
    | {
        type: "edit";
        backroom: BuildingBackroom;
      };
};

const FormCardWrapper = ({ data }: Props) => {
  return (
    <Card>
      <CardContent>
        {data.type === "add" && <AddBuildingTypeForm />}
        {data.type === "edit" && (
          <EditBuildingBackroomForm buildingBackroom={data.backroom} />
        )}
      </CardContent>
    </Card>
  );
};

export default FormCardWrapper;
