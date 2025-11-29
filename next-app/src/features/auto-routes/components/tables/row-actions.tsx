"use client";

import { revPath } from "@/actions/revalidate";
import { CustomButton } from "@/components/custom-button";
import { AutoRouteIcon } from "@/components/icons/auto-route";
import { CopyIcon } from "@/components/icons/copy";
import { EditIcon } from "@/components/icons/edit";
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
import { autoRoutesTitle } from "@/constants/page-title/auto-routes";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { AutoRoute } from "@/core/cog/auto-route/types/auto-route";
import { useCustomCopyToClipboard } from "@/hooks/use-custom-copy-to-clipboard";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteAutoRoute } from "../../actions/delete";

interface Props {
  autoRoute: AutoRoute;
}

const RowActions = ({ autoRoute }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { handleCopy } = useCustomCopyToClipboard();
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
          <DropdownMenuItem onClick={handleCopy(autoRoute.id)}>
            <CopyIcon /> Copy ID
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href={`${playthroughTitle.href}/${autoRoute.cog_playthroughId + autoRoutesTitle.href}/${autoRoute.id}`}
            >
              <AutoRouteIcon />
              Go to
              <span className="line-clamp-1 max-w-[120px]">
                &quot;
                {autoRoute.name}
                &quot;
              </span>
            </Link>
          </DropdownMenuItem>

          {session &&
            autoRoute.auth_userId === session.user.id &&
            !autoRoute.playthrough.is_finished && (
              <>
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link
                    href={`${playthroughTitle.href}/${autoRoute.cog_playthroughId + autoRoutesTitle.href}/${autoRoute.id}/edit`}
                  >
                    <EditIcon />
                    Edit
                    <span className="line-clamp-1 max-w-[120px]">
                      &quot;
                      {autoRoute.name}
                      &quot;
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setOpenDeleteDialog(true)}
                >
                  <TrashIcon />
                  Delete
                  <span className="line-clamp-1 max-w-[120px]">
                    &quot;
                    {autoRoute.name}
                    &quot;
                  </span>
                </DropdownMenuItem>
              </>
            )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default RowActions;
