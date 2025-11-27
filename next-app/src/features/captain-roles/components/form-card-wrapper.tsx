"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CaptainRole } from "@/core/cog/captain-role/types/captain-role";
import { cog_side_effect } from "@/generated/prisma";
import dynamic from "next/dynamic";
import { AddCaptainRoleFormSkeleton } from "./form/add";
import { EditCaptainRoleFormSkeleton } from "./form/edit";
const AddCaptainRoleForm = dynamic(() => import("./form/add"), {
  ssr: false,
  loading: () => <AddCaptainRoleFormSkeleton />,
});
const EditCaptainRoleForm = dynamic(() => import("./form/edit"), {
  ssr: false,
  loading: () => <EditCaptainRoleFormSkeleton />,
});

type Props = {
  data:
    | {
        type: "add";
        sideEffects: cog_side_effect[] | undefined;
      }
    | {
        type: "edit";
        role: CaptainRole;
        sideEffects: cog_side_effect[] | undefined;
      };
};

const FormCardWrapper = ({ data }: Props) => {
  return (
    <Card>
      <CardContent>
        {data.type === "add" && (
          <AddCaptainRoleForm sideEffects={data.sideEffects || []} />
        )}
        {data.type === "edit" && (
          <EditCaptainRoleForm
            role={data.role}
            sideEffects={data.sideEffects || []}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default FormCardWrapper;
