"use client";

import { Card, CardContent } from "@/components/ui/card";
import { PoliceOfficer } from "@/core/db/police-officer/types/police-officer";
import dynamic from "next/dynamic";
import { AddPoliceOfficerFormSkeleton } from "./form/add";
import { EditPoliceOfficerFormSkeleton } from "./form/edit";
const AddPoliceOfficerForm = dynamic(() => import("./form/add"), {
  ssr: false,
  loading: () => <AddPoliceOfficerFormSkeleton />,
});
const EditPoliceOfficerForm = dynamic(() => import("./form/edit"), {
  ssr: false,
  loading: () => <EditPoliceOfficerFormSkeleton />,
});

type Props = {
  data:
    | {
        type: "add";
        playthroughId: string;
      }
    | {
        type: "edit";
        policeOfficer: PoliceOfficer;
      };
};

const FormCardWrapper = ({ data }: Props) => {
  return (
    <Card>
      <CardContent>
        {data.type === "add" && (
          <AddPoliceOfficerForm playthrough={data.playthroughId} />
        )}
        {data.type === "edit" && (
          <EditPoliceOfficerForm policeOfficer={data.policeOfficer} />
        )}
      </CardContent>
    </Card>
  );
};

export default FormCardWrapper;
