"use client";

import { revPath } from "@/actions/revalidate";
import { CustomButton } from "@/components/custom-button";
import { BuildingSizeIcon } from "@/components/icons/building-size";
import { TrashIcon } from "@/components/icons/trash";
import ResponsiveDialog from "@/components/responsive-dialog";
import { DIALOG_MESSAGES, MESSAGES } from "@/constants/messages";
import { buildingSizesTitle } from "@/constants/page-title/building-sizes";
import { BuildingSize } from "@/core/cog/building-size/types/building-size";
import RowActionDropdown from "@/core/table/components/row-action-dropdown";
import { UserRole } from "@/generated/prisma";
import { useCustomCopyToClipboard } from "@/hooks/use-custom-copy-to-clipboard";
import { useSession } from "@/lib/auth-client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteBuildingSize } from "../../actions/delete";

interface Props {
  buildingSize: BuildingSize;
}

const RowActions = ({ buildingSize }: Props) => {
  const [isPending, startTransition] = useTransition();
  const { handleCopy } = useCustomCopyToClipboard();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { data: session } = useSession();

  const handleDelete = () => {
    startTransition(async () => {
      setOpenDeleteDialog(false);

      await deleteBuildingSize(buildingSize.id)
        .then(async (data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);

            setTimeout(() => {
              revPath(buildingSizesTitle.href);
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
            resource: buildingSizesTitle.label.singular.toLowerCase(),
            resourceName: buildingSize.name,
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
        id={buildingSize.id}
        resourceName={buildingSize.name}
        goTo={{
          href: `${buildingSizesTitle.href}/${buildingSize.id}`,
          icon: BuildingSizeIcon,
        }}
        showEditDelete={
          (session && session.user.role !== UserRole.USER) || false
        }
        editHref={`${buildingSizesTitle.href}/${buildingSize.id}/edit`}
        isPending={isPending}
        setOpenDeleteDialog={setOpenDeleteDialog}
      />
    </>
  );
};

export default RowActions;
