"use client";

import { revPath } from "@/actions/revalidate";
import { CustomButton } from "@/components/custom-button";
import { GamblingFeatureIcon } from "@/components/icons/gambling-feature";
import { TrashIcon } from "@/components/icons/trash";
import ResponsiveDialog from "@/components/responsive-dialog";
import { DIALOG_MESSAGES, MESSAGES } from "@/constants/messages";
import { gamblingFeatureTitle } from "@/constants/page-title/gambling-feature";
import { GamblingFeature } from "@/core/cog/gambling-feature/types/gambling-feature";
import RowActionDropdown from "@/core/table/components/row-action-dropdown";
import { UserRole } from "@/generated/prisma";
import { useSession } from "@/lib/auth-client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteGamblingFeature } from "../../actions/delete";

interface Props {
  gamblingFeature: GamblingFeature;
}

const RowActions = ({ gamblingFeature }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { data: session } = useSession();

  const handleDelete = () => {
    startTransition(async () => {
      setOpenDeleteDialog(false);
      await deleteGamblingFeature(gamblingFeature.id)
        .then(async (data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);

            setTimeout(() => {
              revPath(gamblingFeatureTitle.href);
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
            resource: gamblingFeatureTitle.label.singular.toLowerCase(),
            resourceName: gamblingFeature.name,
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
        id={gamblingFeature.id}
        resourceName={gamblingFeature.name}
        goTo={{
          href: `${gamblingFeatureTitle.href}/${gamblingFeature.id}`,
          icon: GamblingFeatureIcon,
        }}
        showEditDelete={
          (session && session.user.role !== UserRole.USER) || false
        }
        editHref={`${gamblingFeatureTitle.href}/${gamblingFeature.id}/edit`}
        isPending={isPending}
        setOpenDeleteDialog={setOpenDeleteDialog}
      />
    </>
  );
};

export default RowActions;
