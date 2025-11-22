"use client";

import { revPath } from "@/actions/revalidate";
import { CustomButton } from "@/components/custom-button";
import { CopyIcon } from "@/components/icons/copy";
import { EditIcon } from "@/components/icons/edit";
import { MoreIcon } from "@/components/icons/more";
import { SirenIcon } from "@/components/icons/siren";
import { TrashIcon } from "@/components/icons/trash";
import ResponsiveDialog from "@/components/responsive-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DIALOG_MESSAGES, MESSAGES } from "@/constants/messages";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { policeOfficersTitle } from "@/constants/page-title/police-officers";
import { PoliceOfficer } from "@/core/db/police-officer/types/police-officer";
import { UserRole } from "@/generated/prisma";
import { useCustomCopyToClipboard } from "@/hooks/use-custom-copy-to-clipboard";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deletePoliceOfficer } from "../../actions/delete";

interface Props {
  policeOfficer: PoliceOfficer;
}

const RowActions = ({ policeOfficer }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { handleCopy } = useCustomCopyToClipboard();
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={isPending}>
          <CustomButton
            buttonLabel="More"
            size={"icon"}
            icon={MoreIcon}
            iconPlacement="left"
            variant={"outline"}
            className="size-8"
            skeletonClassName="size-8"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleCopy(policeOfficer.id)}>
            <CopyIcon /> Copy ID
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href={`${playthroughTitle.href}/${policeOfficer.cog_playthroughId + policeOfficersTitle.href}/${policeOfficer.id}`}
            >
              <SirenIcon />
              Go to {policeOfficersTitle.label.singular.toLowerCase()}
            </Link>
          </DropdownMenuItem>

          {session && session.user.role !== UserRole.USER && (
            <>
              <DropdownMenuSeparator />

              {!policeOfficer.cogPlaythrough.is_finished && (
                <>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`${playthroughTitle.href}/${policeOfficer.cog_playthroughId + policeOfficersTitle.href}/${policeOfficer.id}/edit`}
                    >
                      <EditIcon />
                      Edit {policeOfficersTitle.label.singular.toLowerCase()}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}

              <DropdownMenuItem
                variant="destructive"
                onClick={() => setOpenDeleteDialog(true)}
              >
                <TrashIcon />
                Delete {policeOfficersTitle.label.singular.toLowerCase()}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default RowActions;
