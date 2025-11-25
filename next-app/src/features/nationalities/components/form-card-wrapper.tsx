"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cog_nationality } from "@/generated/prisma";
import dynamic from "next/dynamic";
import { AddNationalityFormSkeleton } from "./form/add";
import { EditNationalityFormSkeleton } from "./form/edit";
const AddNationalityForm = dynamic(() => import("./form/add"), {
  ssr: false,
  loading: () => <AddNationalityFormSkeleton />,
});
const EditNationalityForm = dynamic(() => import("./form/edit"), {
  ssr: false,
  loading: () => <EditNationalityFormSkeleton />,
});

type Props = {
  data:
    | {
        type: "add";
      }
    | {
        type: "edit";
        nationality: cog_nationality;
      };
};

const FormCardWrapper = ({ data }: Props) => {
  return (
    <Card>
      <CardContent>
        {data.type === "add" && <AddNationalityForm />}
        {data.type === "edit" && (
          <EditNationalityForm nationality={data.nationality} />
        )}
      </CardContent>
    </Card>
  );
};

export default FormCardWrapper;
