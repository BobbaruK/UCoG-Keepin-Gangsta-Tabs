"use client";

import { revPath } from "@/actions/revalidate";
import { CustomButton } from "@/components/custom-button";
import { PlaythroughIcon } from "@/components/icons/playthrough";
import { TrashIcon } from "@/components/icons/trash";
import ResponsiveDialog from "@/components/responsive-dialog";
import { DIALOG_MESSAGES, MESSAGES } from "@/constants/messages";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { Playthrough } from "@/core/cog/playthrough/types/playthrough";
import RowActionDropdown from "@/core/table/components/row-action-dropdown";
import { useSession } from "@/lib/auth-client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deletePlaythrough } from "../../actions/delete";

interface Props {
  playthrough: Playthrough;
}

const RowActions = ({ playthrough }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { data: session } = useSession();

  const handleDelete = () => {
    startTransition(async () => {
      setOpenDeleteDialog(false);

      await deletePlaythrough(playthrough)
        .then(async (data) => {
          if (data.error) {
            toast.error(data.error);
            setOpenDeleteDialog(false);
          }
          if (data.success) {
            toast.success(data.success);

            setTimeout(() => {
              revPath(playthroughTitle.href);
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
            resource: playthroughTitle.label.singular.toLowerCase(),
            resourceName: playthrough.name,
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
        id={playthrough.id}
        resourceName={playthrough.name}
        goTo={{
          href: `${playthroughTitle.href}/${playthrough.id}`,
          icon: PlaythroughIcon,
        }}
        showEditDelete={
          (session &&
            playthrough.auth_userId === session.user.id &&
            !playthrough.is_finished) ||
          false
        }
        editHref={`${playthroughTitle.href}/${playthrough.id}/edit`}
        isPending={isPending}
        setOpenDeleteDialog={setOpenDeleteDialog}
      />
    </>
  );
};

export default RowActions;
