"use client";

import { revPath } from "@/actions/revalidate";
import { CustomButton } from "@/components/custom-button";
import { BuildingBackroomIcon } from "@/components/icons/building-backroom";
import { TrashIcon } from "@/components/icons/trash";
import ResponsiveDialog from "@/components/responsive-dialog";
import { DIALOG_MESSAGES, MESSAGES } from "@/constants/messages";
import { buildingBackroomsTitle } from "@/constants/page-title/building-backrooms";
import { BuildingBackroom } from "@/core/cog/building-backroom/types/building-backroom";
import RowActionDropdown from "@/core/table/components/row-action-dropdown";
import { UserRole } from "@/generated/prisma";
import { useSession } from "@/lib/auth-client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteBuildingBackroom } from "../../actions/delete";

interface Props {
  buildingBackroom: BuildingBackroom;
}

const RowActions = ({ buildingBackroom }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { data: session } = useSession();

  const handleDelete = () => {
    startTransition(async () => {
      setOpenDeleteDialog(false);

      await deleteBuildingBackroom(buildingBackroom.id)
        .then(async (data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);

            setTimeout(() => {
              revPath(buildingBackroomsTitle.href);
            }, 250);
          }
        })
        .catch(() => {
          toast.error(MESSAGES.SOMETHING_WRONG);
        });
    });
  };

  return (
    <>
      <ResponsiveDialog
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        trigger={{
          type: "element",
          element: (
            <CustomButton
              buttonLabel="Delete"
              variant={"destructive"}
              className="w-full"
              disabled={isPending}
              onClick={() => setOpenDeleteDialog(true)}
            />
          ),
          hidden: true,
        }}
        header={
          DIALOG_MESSAGES({
            resource: buildingBackroomsTitle.label.singular.toLowerCase(),
            resourceName: buildingBackroom.name,
          }).DELETE
        }
      >
        <div className="flex items-center justify-end">
          <CustomButton
            buttonLabel="Delete"
            variant={"destructive"}
            icon={TrashIcon}
            iconPlacement="left"
            hideLabelOnMobile={false}
            className="ms-auto max-sm:w-full"
            onClick={handleDelete}
          />
        </div>
      </ResponsiveDialog>

      <RowActionDropdown
        id={buildingBackroom.id}
        resourceName={buildingBackroom.name}
        goTo={{
          href: `${buildingBackroomsTitle.href}/${buildingBackroom.id}`,
          icon: BuildingBackroomIcon,
        }}
        showEditDelete={
          (session && session.user.role !== UserRole.USER) || false
        }
        editHref={`${buildingBackroomsTitle.href}/${buildingBackroom.id}/edit`}
        isPending={isPending}
        setOpenDeleteDialog={setOpenDeleteDialog}
      />
    </>
  );
};

export default RowActions;
