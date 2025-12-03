"use client";

import { revPath } from "@/actions/revalidate";
import { CustomButton } from "@/components/custom-button";
import { BuildingPassiveIcon } from "@/components/icons/building-passive";
import { TrashIcon } from "@/components/icons/trash";
import ResponsiveDialog from "@/components/responsive-dialog";
import { DIALOG_MESSAGES, MESSAGES } from "@/constants/messages";
import { buildingPassiveTitle } from "@/constants/page-title/building-passive";
import { BuildingPassive } from "@/core/cog/building-passive/types/building-passive-duration";
import RowActionDropdown from "@/core/table/components/row-action-dropdown";
import { UserRole } from "@/generated/prisma";
import { useSession } from "@/lib/auth-client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteBuildingPassive } from "../../actions/delete";

interface Props {
  buildingPassive: BuildingPassive;
}

const RowActions = ({ buildingPassive }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { data: session } = useSession();

  const handleDelete = () => {
    startTransition(async () => {
      setOpenDeleteDialog(false);

      await deleteBuildingPassive(buildingPassive.id)
        .then(async (data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);

            setTimeout(() => {
              revPath(buildingPassiveTitle.href);
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
            resource: buildingPassiveTitle.label.singular.toLowerCase(),
            resourceName: `${buildingPassive.resource?.name} (${buildingPassive.quantity})`,
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
        id={buildingPassive.id}
        resourceName={`${buildingPassive.resource?.name} (${buildingPassive.quantity})`}
        goTo={{
          href: `${buildingPassiveTitle.href}/${buildingPassive.id}`,
          icon: BuildingPassiveIcon,
        }}
        showEditDelete={
          (session && session.user.role !== UserRole.USER) || false
        }
        editHref={`${buildingPassiveTitle.href}/${buildingPassive.id}/edit`}
        isPending={isPending}
        setOpenDeleteDialog={setOpenDeleteDialog}
      />
    </>
  );
};

export default RowActions;
