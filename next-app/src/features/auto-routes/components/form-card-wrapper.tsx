"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AutoRouteType } from "@/core/cog/auto-route-type/types/auto-route-type";
import { CrewMember } from "@/core/cog/crew-member/types/crew-member";
import { Playthrough } from "@/core/cog/playthrough/types/playthrough";
import { PoliceOfficer } from "@/core/cog/police-officer/types/police-officer";
import { VehicleType } from "@/core/cog/vehicle-type/types/vehicle-type";
import dynamic from "next/dynamic";
import { AddAutoRouteFormSkeleton } from "./form/add";
const AddAutoRouteForm = dynamic(() => import("./form/add"), {
  ssr: false,
  loading: () => <AddAutoRouteFormSkeleton />,
});
// const EditPoliceOfficerForm = dynamic(() => import("./form/edit"), {
//   ssr: false,
//   loading: () => <EditPoliceOfficerFormSkeleton />,
// });

type Props = {
  data: (
    | {
        type: "add";
        playthrough: Playthrough;
      }
    | {
        type: "edit";
        policeOfficer: PoliceOfficer;
      }
  ) & {
    crewMembers?: CrewMember[];
    vehicleTypes?: VehicleType[];
    autoRouteTypes?: AutoRouteType[];
  };
};

const FormCardWrapper = ({ data }: Props) => {
  return (
    <Card>
      <CardContent>
        {data.type === "add" && (
          <AddAutoRouteForm
            playthrough={data.playthrough}
            crewMembers={data.crewMembers}
            vehicleTypes={data.vehicleTypes}
            autoRouteTypes={data.autoRouteTypes}
          />
        )}
        {data.type === "edit" && null}
      </CardContent>
    </Card>
  );
};

export default FormCardWrapper;
