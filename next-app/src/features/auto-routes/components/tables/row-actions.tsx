"use client";

import { revPath } from "@/actions/revalidate";
import { CustomButton } from "@/components/custom-button";
import { AutoRouteIcon } from "@/components/icons/auto-route";
import { TrashIcon } from "@/components/icons/trash";
import ResponsiveDialog from "@/components/responsive-dialog";
import { DIALOG_MESSAGES, MESSAGES } from "@/constants/messages";
import { autoRoutesTitle } from "@/constants/page-title/auto-routes";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { AutoRoute } from "@/core/cog/auto-route/types/auto-route";
import RowActionDropdown from "@/core/table/components/row-action-dropdown";
import { useSession } from "@/lib/auth-client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteAutoRoute } from "../../actions/delete";

interface Props {
  autoRoute: AutoRoute;
}

const RowActions = ({ autoRoute }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { data: session } = useSession();

  const handleDelete = () => {
    startTransition(async () => {
      setOpenDeleteDialog(false);

      await deleteAutoRoute(autoRoute)
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
                `${playthroughTitle.href}/${autoRoute.cog_playthroughId + autoRoutesTitle.href}`,
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
            resource: autoRoutesTitle.label.singular.toLowerCase(),
            resourceName: autoRoute.name,
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
        id={autoRoute.id}
        resourceName={autoRoute.name}
        goTo={{
          href: `${playthroughTitle.href}/${autoRoute.cog_playthroughId + autoRoutesTitle.href}/${autoRoute.id}`,
          icon: AutoRouteIcon,
        }}
        showEditDelete={
          (session &&
            autoRoute.auth_userId === session.user.id &&
            !autoRoute.playthrough.is_finished) ||
          false
        }
        editHref={`${playthroughTitle.href}/${autoRoute.cog_playthroughId + autoRoutesTitle.href}/${autoRoute.id}/edit`}
        isPending={isPending}
        setOpenDeleteDialog={setOpenDeleteDialog}
      />
    </>
  );
};

export default RowActions;
