"use client";

import { revPath } from "@/actions/revalidate";
import { CustomButton } from "@/components/custom-button";
import { CopyIcon } from "@/components/icons/copy";
import { EditIcon } from "@/components/icons/edit";
import { GamblingBuildingIcon } from "@/components/icons/gambling-building";
import { MoreIcon } from "@/components/icons/more";
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
import { gamblingBuildingsTitle } from "@/constants/page-title/gambling-buildings";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { GamblingBuilding } from "@/core/cog/gambling-building/types/gambling-building";
import { useCustomCopyToClipboard } from "@/hooks/use-custom-copy-to-clipboard";
import { useSession } from "@/lib/auth-client";
import { setFullName } from "@/lib/utils/full-name";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteGamblingBuilding } from "../../actions/delete";

interface Props {
  gamblingBuilding: GamblingBuilding;
}

const RowActions = ({ gamblingBuilding }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { handleCopy } = useCustomCopyToClipboard();
  const { data: session } = useSession();

  const handleDelete = () => {
    startTransition(async () => {
      setOpenDeleteDialog(false);

      await deleteGamblingBuilding(gamblingBuilding)
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
                `${playthroughTitle.href}/${gamblingBuilding.playthrough_id + gamblingBuildingsTitle.href}`,
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
            resource: gamblingBuildingsTitle.label.singular.toLowerCase(),
            resourceName: setFullName({
              firstName: gamblingBuilding.manager.first_name,
              lastName: gamblingBuilding.manager.last_name,
              alias: gamblingBuilding.manager.alias,
            }).outputFE,
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
          <DropdownMenuItem onClick={handleCopy(gamblingBuilding.id)}>
            <CopyIcon /> Copy ID
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href={`${playthroughTitle.href}/${gamblingBuilding.playthrough_id + gamblingBuildingsTitle.href}/${gamblingBuilding.id}`}
            >
              <GamblingBuildingIcon />
              Go to {gamblingBuildingsTitle.label.singular.toLowerCase()}
            </Link>
          </DropdownMenuItem>

          {session &&
            gamblingBuilding.user_id === session.user.id &&
            !gamblingBuilding.playthrough.is_finished && (
              <>
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link
                    href={`${playthroughTitle.href}/${gamblingBuilding.playthrough_id + gamblingBuildingsTitle.href}/${gamblingBuilding.id}/edit`}
                  >
                    <EditIcon />
                    Edit {gamblingBuildingsTitle.label.singular.toLowerCase()}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setOpenDeleteDialog(true)}
                >
                  <TrashIcon />
                  Delete {gamblingBuildingsTitle.label.singular.toLowerCase()}
                </DropdownMenuItem>
              </>
            )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default RowActions;
