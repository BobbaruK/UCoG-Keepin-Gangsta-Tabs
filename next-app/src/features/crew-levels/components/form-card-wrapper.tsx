"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CrewLevel } from "@/core/db/crew-level/types/crew-level";
import dynamic from "next/dynamic";
import { AddCrewLevelFormSkeleton } from "./form/add";
import { EditCrewLevelFormSkeleton } from "./form/edit";
const AddCrewLevelForm = dynamic(() => import("./form/add"), {
  ssr: false,
  loading: () => <AddCrewLevelFormSkeleton />,
});
const EditCrewLevelForm = dynamic(() => import("./form/edit"), {
  ssr: false,
  loading: () => <EditCrewLevelFormSkeleton />,
});

type Props = {
  data:
    | {
        type: "add";
      }
    | {
        type: "edit";
        level: CrewLevel;
      };
};

const FormCardWrapper = ({ data }: Props) => {
  return (
    <Card>
      <CardContent>
        {data.type === "add" && <AddCrewLevelForm />}
        {data.type === "edit" && <EditCrewLevelForm level={data.level} />}
      </CardContent>
    </Card>
  );
};

export default FormCardWrapper;
