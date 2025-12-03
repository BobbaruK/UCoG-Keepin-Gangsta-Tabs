"use client";

import { revPath } from "@/actions/revalidate";
import { CustomButton } from "@/components/custom-button";
import { PoliceOfficerIcon } from "@/components/icons/police-officer";
import { TrashIcon } from "@/components/icons/trash";
import ResponsiveDialog from "@/components/responsive-dialog";
import { DIALOG_MESSAGES, MESSAGES } from "@/constants/messages";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { policeOfficersTitle } from "@/constants/page-title/police-officers";
import { PoliceOfficer } from "@/core/cog/police-officer/types/police-officer";
import RowActionDropdown from "@/core/table/components/row-action-dropdown";
import { useSession } from "@/lib/auth-client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deletePoliceOfficer } from "../../actions/delete";

interface Props {
  policeOfficer: PoliceOfficer;
}

const RowActions = ({ policeOfficer }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { data: session } = useSession();

  const handleDelete = () => {
    startTransition(async () => {
      setOpenDeleteDialog(false);

      await deletePoliceOfficer(policeOfficer)
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
                `${playthroughTitle.href}/${policeOfficer.cog_playthroughId + policeOfficersTitle.href}`,
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
            resource: policeOfficersTitle.label.singular.toLowerCase(),
            resourceName: policeOfficer.name,
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
        id={policeOfficer.id}
        resourceName={policeOfficer.name}
        goTo={{
          href: `${playthroughTitle.href}/${policeOfficer.cog_playthroughId + policeOfficersTitle.href}/${policeOfficer.id}`,
          icon: PoliceOfficerIcon,
        }}
        showEditDelete={
          (session &&
            policeOfficer.auth_userId === session.user.id &&
            !policeOfficer.cogPlaythrough.is_finished) ||
          false
        }
        editHref={`${playthroughTitle.href}/${policeOfficer.cog_playthroughId + policeOfficersTitle.href}/${policeOfficer.id}/edit`}
        isPending={isPending}
        setOpenDeleteDialog={setOpenDeleteDialog}
      />
    </>
  );
};

export default RowActions;
