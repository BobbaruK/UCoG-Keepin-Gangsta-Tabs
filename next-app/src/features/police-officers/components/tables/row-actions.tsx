"use client";

import { CustomButton } from "@/components/custom-button";
import { EditIcon } from "@/components/icons/edit";
import { TrashIcon } from "@/components/icons/trash";
import ResponsiveDialog from "@/components/responsive-dialog";
import { MESSAGES } from "@/constants/messages";
import { policeOfficersTitle } from "@/constants/page-title/police-officers";
import { lazy, Suspense, useState, useTransition } from "react";
import { toast } from "sonner";
import { deletePoliceOfficer } from "../../actions/delete";
import { PoliceOfficer } from "../../types/police-officer";
import { EditPoliceOfficerFormSkeleton } from "../form/edit";
const EditPoliceOfficerForm = lazy(() => import("../form/edit"));

interface Props {
  policeOfficer: PoliceOfficer;
}

const RowActions = ({ policeOfficer }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditPoliceOfficer, setOpenEditPoliceOfficer] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      await deletePoliceOfficer(policeOfficer)
        .then(async (data) => {
          if (data.error) {
            toast.error(data.error);
            setOpenDeleteDialog(false);
          }
          if (data.success) {
            toast.success(data.success);
          }
        })
        .catch(() => {
          toast.error(MESSAGES.SOMETHING_WRONG);
        });
    });
  };

  return (
    <div className="flex items-center gap-2">
      <ResponsiveDialog
        open={openEditPoliceOfficer}
        setOpen={setOpenEditPoliceOfficer}
        trigger={{
          type: "element",
          element: (
            <CustomButton
              buttonLabel="Edit"
              variant={"outline"}
              icon={EditIcon}
              iconPlacement="left"
              size={"icon"}
              className="size-8"
              disabled={isPending}
              skeletonClassName="size-8"
            />
          ),
          hidden: false,
        }}
        header={{
          title: {
            label: `Edit ${policeOfficersTitle.label.singular.toLowerCase()}`,
          },
        }}
      >
        <Suspense fallback={<EditPoliceOfficerFormSkeleton />}>
          <EditPoliceOfficerForm
            policeOfficer={policeOfficer}
            editOfficerDialog={(open) => {
              setOpenEditPoliceOfficer(open);
            }}
          />
        </Suspense>
      </ResponsiveDialog>

      <ResponsiveDialog
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        trigger={{
          type: "element",
          element: (
            <CustomButton
              buttonLabel="Delete"
              variant={"destructive"}
              icon={TrashIcon}
              iconPlacement="left"
              size={"icon"}
              className="size-8"
              disabled={isPending}
              onClick={() => setOpenDeleteDialog(true)}
              skeletonClassName="size-8"
            />
          ),
          hidden: false,
        }}
        header={{
          title: {
            label: "Are you absolutely sure?",
          },
          description: `This action cannot be undone. This will permanently delete this ${policeOfficersTitle.label.singular.toLowerCase()} and remove it's data from our servers.`,
        }}
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
    </div>
  );
};

export default RowActions;
