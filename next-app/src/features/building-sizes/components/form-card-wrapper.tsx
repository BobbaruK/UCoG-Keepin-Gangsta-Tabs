"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BuildingSize } from "@/core/cog/building-size/types/building-size";
import dynamic from "next/dynamic";
import { AddBuildingSizeFormSkeleton } from "./form/add";
import { EditBuildingBackroomFormSkeleton } from "./form/edit";
const AddBuildingSizeForm = dynamic(() => import("./form/add"), {
  ssr: false,
  loading: () => <AddBuildingSizeFormSkeleton />,
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
        sizes: BuildingSize;
      };
};

const FormCardWrapper = ({ data }: Props) => {
  return (
    <Card>
      <CardContent>
        {data.type === "add" && <AddBuildingSizeForm />}
        {data.type === "edit" && (
          <EditBuildingBackroomForm buildingSize={data.sizes} />
        )}
      </CardContent>
    </Card>
  );
};

export default FormCardWrapper;
