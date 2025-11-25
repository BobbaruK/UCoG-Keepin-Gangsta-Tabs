"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cog_law, cog_side_effect } from "@/generated/prisma";
import dynamic from "next/dynamic";
import { AddLawFormSkeleton } from "./form/add";
import { EditLawFormSkeleton } from "./form/edit";
const AddLawForm = dynamic(() => import("./form/add"), {
  ssr: false,
  loading: () => <AddLawFormSkeleton />,
});
const EditLawForm = dynamic(() => import("./form/edit"), {
  ssr: false,
  loading: () => <EditLawFormSkeleton />,
});

type Props = {
  data:
    | {
        type: "add";
        sideEffects: cog_side_effect[] | undefined;
      }
    | {
        type: "edit";
        law: cog_law;
        sideEffects: cog_side_effect[] | undefined;
      };
};

const FormCardWrapper = ({ data }: Props) => {
  return (
    <Card>
      <CardContent>
        {data.type === "add" && <AddLawForm sideEffects={data.sideEffects} />}
        {data.type === "edit" && (
          <EditLawForm law={data.law} sideEffects={data.sideEffects} />
        )}
      </CardContent>
    </Card>
  );
};

export default FormCardWrapper;
