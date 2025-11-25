"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cog_resource_type } from "@/generated/prisma";
import dynamic from "next/dynamic";
import { AddResourceTypeFormSkeleton } from "./form/add";
import { EditResourceTypeFormSkeleton } from "./form/edit";
const AddResourceTypeForm = dynamic(() => import("./form/add"), {
  ssr: false,
  loading: () => <AddResourceTypeFormSkeleton />,
});
const EditResourceTypeForm = dynamic(() => import("./form/edit"), {
  ssr: false,
  loading: () => <EditResourceTypeFormSkeleton />,
});

type Props = {
  data:
    | {
        type: "add";
      }
    | {
        type: "edit";
        resourceType: cog_resource_type;
      };
};

const FormCardWrapper = ({ data }: Props) => {
  return (
    <Card>
      <CardContent>
        {data.type === "add" && <AddResourceTypeForm />}
        {data.type === "edit" && (
          <EditResourceTypeForm resourceType={data.resourceType} />
        )}
      </CardContent>
    </Card>
  );
};

export default FormCardWrapper;
