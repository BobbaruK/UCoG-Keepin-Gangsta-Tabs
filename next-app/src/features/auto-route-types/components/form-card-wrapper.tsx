"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AutoRouteType } from "@/core/cog/auto-route-type/types/auto-route-type";
import dynamic from "next/dynamic";
import { AddAutoRouteTypeFormSkeleton } from "./form/add";
import { EditAutoRouteTypeFormSkeleton } from "./form/edit";
const AddAutoRouteTypeForm = dynamic(() => import("./form/add"), {
  ssr: false,
  loading: () => <AddAutoRouteTypeFormSkeleton />,
});
const EditAutoRouteTypeForm = dynamic(() => import("./form/edit"), {
  ssr: false,
  loading: () => <EditAutoRouteTypeFormSkeleton />,
});

type Props = {
  data:
    | {
        type: "add";
      }
    | {
        type: "edit";
        routeType: AutoRouteType;
      };
};

const FormCardWrapper = ({ data }: Props) => {
  return (
    <Card>
      <CardContent>
        {data.type === "add" && <AddAutoRouteTypeForm />}
        {data.type === "edit" && (
          <EditAutoRouteTypeForm autoRouteType={data.routeType} />
        )}
      </CardContent>
    </Card>
  );
};

export default FormCardWrapper;
