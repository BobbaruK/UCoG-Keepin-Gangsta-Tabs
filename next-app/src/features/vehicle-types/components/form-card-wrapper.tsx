"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cog_vehicle_type } from "@/generated/prisma";
import dynamic from "next/dynamic";
import { AddVehicleTypeFormSkeleton } from "./form/add";
import { EditVehicleTypeFormSkeleton } from "./form/edit";
const AddVehicleTypeForm = dynamic(() => import("./form/add"), {
  ssr: false,
  loading: () => <AddVehicleTypeFormSkeleton />,
});
const EditVehicleTypeForm = dynamic(() => import("./form/edit"), {
  ssr: false,
  loading: () => <EditVehicleTypeFormSkeleton />,
});

type Props = {
  data:
    | {
        type: "add";
      }
    | {
        type: "edit";
        vehicleType: cog_vehicle_type;
      };
};

const FormCardWrapper = ({ data }: Props) => {
  return (
    <Card>
      <CardContent>
        {data.type === "add" && <AddVehicleTypeForm />}
        {data.type === "edit" && (
          <EditVehicleTypeForm vehicleType={data.vehicleType} />
        )}
      </CardContent>
    </Card>
  );
};

export default FormCardWrapper;
