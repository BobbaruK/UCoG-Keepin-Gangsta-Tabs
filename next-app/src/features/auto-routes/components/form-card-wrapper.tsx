"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AutoRouteType } from "@/core/cog/auto-route-type/types/auto-route-type";
import { AutoRoute } from "@/core/cog/auto-route/types/auto-route";
import { CrewMember } from "@/core/cog/crew-member/types/crew-member";
import { Playthrough } from "@/core/cog/playthrough/types/playthrough";
import { VehicleType } from "@/core/cog/vehicle-type/types/vehicle-type";
import dynamic from "next/dynamic";
import { AddAutoRouteFormSkeleton } from "./form/add";
import { EditAutoRouteFormSkeleton } from "./form/edit";
const AddAutoRouteForm = dynamic(() => import("./form/add"), {
  ssr: false,
  loading: () => <AddAutoRouteFormSkeleton />,
});
const EditAutoRouteForm = dynamic(() => import("./form/edit"), {
  ssr: false,
  loading: () => <EditAutoRouteFormSkeleton />,
});

type Props = {
  data: (
    | {
        type: "add";
        playthrough: Playthrough;
      }
    | {
        type: "edit";
        autoRoute: AutoRoute;
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
        {data.type === "edit" && (
          <EditAutoRouteForm
            autoRoute={data.autoRoute}
            crewMembers={data.crewMembers}
            vehicleTypes={data.vehicleTypes}
            autoRouteTypes={data.autoRouteTypes}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default FormCardWrapper;
