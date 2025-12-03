"use client";

import { revPath } from "@/actions/revalidate";
import { CustomButton } from "@/components/custom-button";
import { AutoRouteTypesIcon } from "@/components/icons/auto-route-types";
import { TrashIcon } from "@/components/icons/trash";
import ResponsiveDialog from "@/components/responsive-dialog";
import { DIALOG_MESSAGES, MESSAGES } from "@/constants/messages";
import { autoRouteTypesTitle } from "@/constants/page-title/auto-route-types";
import { AutoRouteType } from "@/core/cog/auto-route-type/types/auto-route-type";
import RowActionDropdown from "@/core/table/components/row-action-dropdown";
import { UserRole } from "@/generated/prisma";
import { useSession } from "@/lib/auth-client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteAutoRouteType } from "../../actions/delete";

interface Props {
  autoRouteType: AutoRouteType;
}

const RowActions = ({ autoRouteType }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { data: session } = useSession();

  const handleDelete = () => {
    startTransition(async () => {
      setOpenDeleteDialog(false);

      await deleteAutoRouteType(autoRouteType.id)
        .then(async (data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);

            setTimeout(() => {
              revPath(autoRouteTypesTitle.href);
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
            resource: autoRouteTypesTitle.label.singular.toLowerCase(),
            resourceName: autoRouteType.name,
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
        id={autoRouteType.id}
        resourceName={autoRouteType.name}
        goTo={{
          href: `${autoRouteTypesTitle.href}/${autoRouteType.id}`,
          icon: AutoRouteTypesIcon,
        }}
        showEditDelete={
          (session && session.user.role !== UserRole.USER) || false
        }
        editHref={`${autoRouteTypesTitle.href}/${autoRouteType.id}/edit`}
        isPending={isPending}
        setOpenDeleteDialog={setOpenDeleteDialog}
      />
    </>
  );
};

export default RowActions;
