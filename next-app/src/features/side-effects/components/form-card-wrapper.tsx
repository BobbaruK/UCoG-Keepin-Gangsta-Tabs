"use client";

import { Card, CardContent } from "@/components/ui/card";
import { SideEffect } from "@/core/cog/side-effect/types/side-effect";
import dynamic from "next/dynamic";
import { AddSideEffectFormSkeleton } from "./forms/add";
import { EditSideEffectFormSkeleton } from "./forms/edit";
const AddSideEffectForm = dynamic(() => import("./forms/add"), {
  ssr: false,
  loading: () => <AddSideEffectFormSkeleton />,
});
const EditSideEffectForm = dynamic(() => import("./forms/edit"), {
  ssr: false,
  loading: () => <EditSideEffectFormSkeleton />,
});

type Props = {
  data:
    | {
        type: "add";
      }
    | {
        type: "edit";
        sideEffect: SideEffect;
      };
};

const FormCardWrapper = ({ data }: Props) => {
  return (
    <Card>
      <CardContent>
        {data.type === "add" && <AddSideEffectForm />}
        {data.type === "edit" && (
          <EditSideEffectForm sideEffect={data.sideEffect} />
        )}
      </CardContent>
    </Card>
  );
};

export default FormCardWrapper;
