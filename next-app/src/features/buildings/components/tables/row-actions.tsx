"use client";

import { revPath } from "@/actions/revalidate";
import { CustomButton } from "@/components/custom-button";
import { BuildingIcon } from "@/components/icons/building";
import { TrashIcon } from "@/components/icons/trash";
import ResponsiveDialog from "@/components/responsive-dialog";
import { DIALOG_MESSAGES, MESSAGES } from "@/constants/messages";
import { buildingTitle } from "@/constants/page-title/building";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { Building } from "@/core/cog/building/types/building";
import RowActionDropdown from "@/core/table/components/row-action-dropdown";
import { useSession } from "@/lib/auth-client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteBuilding } from "../../actions/delete";

interface Props {
  building: Building;
}

const RowActions = ({ building }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { data: session } = useSession();

  const handleDelete = () => {
    startTransition(async () => {
      setOpenDeleteDialog(false);

      await deleteBuilding(building)
        .then(async (data) => {
          if (data.error) {
            toast.error(data.error);
            setOpenDeleteDialog(false);
          }
          if (data.success) {
            toast.success(data.success);
            setOpenDeleteDialog(false);

            setTimeout(() => {
              revPath(
                `${playthroughTitle.href}/${building.playthrough_id + buildingTitle.href}`,
              );
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
            resource: buildingTitle.label.singular.toLowerCase(),
            resourceName: building.name,
          }).DELETE
        }
      >
        <CustomButton
          buttonLabel="Delete"
          variant={"destructive"}
          icon={TrashIcon}
          iconPlacement="left"
          hideLabelOnMobile={false}
          className="ms-auto max-sm:w-full"
          onClick={handleDelete}
        />
      </ResponsiveDialog>

      <RowActionDropdown
        id={building.id}
        resourceName={building.name}
        goTo={{
          href: `${playthroughTitle.href}/${building.playthrough_id + buildingTitle.href}/${building.id}`,
          icon: BuildingIcon,
        }}
        showEditDelete={
          (session &&
            building.user_id === session.user.id &&
            !building.playthrough.is_finished) ||
          false
        }
        editHref={`${playthroughTitle.href}/${building.playthrough_id + buildingTitle.href}/${building.id}/edit`}
        isPending={isPending}
        setOpenDeleteDialog={setOpenDeleteDialog}
      />
    </>
  );
};

export default RowActions;
