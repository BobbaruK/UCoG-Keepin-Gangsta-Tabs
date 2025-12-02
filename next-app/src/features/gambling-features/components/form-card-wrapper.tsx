"use client";

import { Card, CardContent } from "@/components/ui/card";
import { GamblingFeature } from "@/core/cog/gambling-feature/types/gambling-feature";
import dynamic from "next/dynamic";
import { AddGamblingSizeFormSkeleton } from "./form/add";
import { EditGamblingSizeFormFormSkeleton } from "./form/edit";
const AddGamblingSizeForm = dynamic(() => import("./form/add"), {
  ssr: false,
  loading: () => <AddGamblingSizeFormSkeleton />,
});
const EditGamblingSizeForm = dynamic(() => import("./form/edit"), {
  ssr: false,
  loading: () => <EditGamblingSizeFormFormSkeleton />,
});

type Props = {
  data:
    | {
        type: "add";
      }
    | {
        type: "edit";
        gamblingFeature: GamblingFeature;
      };
};

const FormCardWrapper = ({ data }: Props) => {
  return (
    <Card>
      <CardContent>
        {data.type === "add" && <AddGamblingSizeForm />}
        {data.type === "edit" && (
          <EditGamblingSizeForm gamblingFeature={data.gamblingFeature} />
        )}
      </CardContent>
    </Card>
  );
};

export default FormCardWrapper;
