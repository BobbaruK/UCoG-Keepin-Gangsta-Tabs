"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cog_side_effect, cog_trait } from "@/generated/prisma";
import dynamic from "next/dynamic";
import { AddTraitFormSkeleton } from "./forms/add";
import { EditTraitFormSkeleton } from "./forms/edit";
const AddTraitForm = dynamic(() => import("./forms/add"), {
  ssr: false,
  loading: () => <AddTraitFormSkeleton />,
});
const EditTraitForm = dynamic(() => import("./forms/edit"), {
  ssr: false,
  loading: () => <EditTraitFormSkeleton />,
});

type Props = {
  data:
    | {
        type: "add";
        sideEffects: cog_side_effect[] | undefined;
      }
    | {
        type: "edit";
        trait: cog_trait;
        sideEffects: cog_side_effect[] | undefined;
      };
};

const FormCardWrapper = ({ data }: Props) => {
  return (
    <Card>
      <CardContent>
        {data.type === "add" && <AddTraitForm sideEffects={data.sideEffects} />}
        {data.type === "edit" && (
          <EditTraitForm sideEffects={data.sideEffects} trait={data.trait} />
        )}
      </CardContent>
    </Card>
  );
};

export default FormCardWrapper;
