"use client";

import { UserRole } from "@/generated/prisma";
import { CustomButton } from "./custom-button";
import { AddIcon } from "./icons/add";
import { ArrowLeftIcon } from "./icons/arrow-left";
import { EditIcon } from "./icons/edit";
import { Session } from "@/types/session";

interface Props {
  label: string;
  addBtnHref?: string;
  editBtnHref?: string;
  backBtnHref?: string;
  session?: Session | null;
}

export const PageTitle = ({
  label,
  addBtnHref,
  editBtnHref,
  backBtnHref,
  session,
}: Props) => {
  return (
    <div className="border-secondary flex flex-wrap items-center justify-between gap-4 border-b pb-2">
      <h1 className="text-3xl font-bold">{label}</h1>

      <div className="flex flex-wrap items-center justify-end gap-4">
        {addBtnHref && session && session?.user.role !== UserRole.USER && (
          <CustomButton
            buttonLabel="Add"
            variant={"outline"}
            icon={AddIcon}
            iconPlacement="left"
            linkHref={addBtnHref}
            size="sm"
            skeletonClassName="h-9 w-[76px]"
          />
        )}

        {editBtnHref && session && session?.user.role !== UserRole.USER && (
          <CustomButton
            buttonLabel="Edit"
            variant={"outline"}
            icon={EditIcon}
            iconPlacement="left"
            linkHref={editBtnHref}
            size="sm"
            skeletonClassName="h-9 w-[75px]"
          />
        )}

        {backBtnHref && (
          <CustomButton
            buttonLabel="Back"
            variant={"outline"}
            icon={ArrowLeftIcon}
            iconPlacement="left"
            linkHref={backBtnHref}
            size="sm"
            skeletonClassName="h-9 w-[80px]"
          />
        )}
      </div>
    </div>
  );
};
