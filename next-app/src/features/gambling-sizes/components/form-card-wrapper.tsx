"use client";

import { Card, CardContent } from "@/components/ui/card";
import dynamic from "next/dynamic";
import { AddGamblingSizeFormSkeleton } from "./form/add";
import { EditGamblingSizeFormFormSkeleton } from "./form/edit";
import { GamblingSize } from "@/core/cog/gambling-size/types/gambling-size";
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
        gamblingSize: GamblingSize;
      };
};

const FormCardWrapper = ({ data }: Props) => {
  return (
    <Card>
      <CardContent>
        {data.type === "add" && <AddGamblingSizeForm />}
        {data.type === "edit" && (
          <EditGamblingSizeForm gamblingSize={data.gamblingSize} />
        )}
      </CardContent>
    </Card>
  );
};

export default FormCardWrapper;
