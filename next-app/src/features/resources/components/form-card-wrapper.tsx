"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cog_resource, cog_resource_type } from "@/generated/prisma";
import dynamic from "next/dynamic";
import { AddResourceFormSkeleton } from "./form/add";
import { EditResourceFormSkeleton } from "./form/edit";
const AddResourceForm = dynamic(() => import("./form/add"), {
  ssr: false,
  loading: () => <AddResourceFormSkeleton />,
});
const EditResourceForm = dynamic(() => import("./form/edit"), {
  ssr: false,
  loading: () => <EditResourceFormSkeleton />,
});

type Props = {
  data:
    | {
        type: "add";
        resourceTypes: cog_resource_type[];
      }
    | {
        type: "edit";
        resource: cog_resource;
        resourceTypes: cog_resource_type[];
      };
};

const FormCardWrapper = ({ data }: Props) => {
  return (
    <Card>
      <CardContent>
        {data.type === "add" && (
          <AddResourceForm resourceTypes={data.resourceTypes} />
        )}
        {data.type === "edit" && (
          <EditResourceForm
            resource={data.resource}
            resourceTypes={data.resourceTypes}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default FormCardWrapper;
