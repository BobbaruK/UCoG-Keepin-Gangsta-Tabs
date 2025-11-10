"use client";

import { UserRole } from "@/generated/prisma";
import { Session } from "@/types/session";
import { CustomButton } from "./custom-button";
import { AddIcon } from "./icons/add";
import { ArrowLeftIcon } from "./icons/arrow-left";
import { EditIcon } from "./icons/edit";

interface Props {
  label: string;
  addBtnHref?: string;
  forceAddButton?: boolean;
  editBtnHref?: string;
  forceEditButton?: boolean;
  backBtnHref?: string;
  session?: Session | null; // TODO: remove session from all instances
}

export const PageTitle = ({
  label,
  addBtnHref,
  forceAddButton,
  editBtnHref,
  forceEditButton,
  backBtnHref,
  session,
}: Props) => {
  return (
    <div className="border-secondary flex flex-wrap items-center justify-between gap-4 border-b pb-2">
      <h1 className="text-3xl font-bold">{label}</h1>

      <div className="flex flex-wrap items-center justify-end gap-4">
        {((addBtnHref && session && session?.user.role !== UserRole.USER) ||
          (forceAddButton && session)) && (
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

        {((editBtnHref && session && session?.user.role !== UserRole.USER) ||
          (forceEditButton && session)) && (
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
