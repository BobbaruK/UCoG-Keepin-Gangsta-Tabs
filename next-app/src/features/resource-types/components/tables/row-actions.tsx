"use client";

import { revPath } from "@/actions/revalidate";
import { CustomButton } from "@/components/custom-button";
import { AnvilIcon } from "@/components/icons/anvil";
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
import { resourceTypesTitle } from "@/constants/page-title/resource-types";
import { ResourceType } from "@/core/db/resource-type/types/resource-type";
import { UserRole } from "@/generated/prisma";
import { useCustomCopyToClipboard } from "@/hooks/use-custom-copy-to-clipboard";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteResourceType } from "../../actions/delete";

interface Props {
  resourceType: ResourceType;
}

const RowActions = ({ resourceType }: Props) => {
  const [isPending, startTransition] = useTransition();
  const { handleCopy } = useCustomCopyToClipboard();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { data: session } = useSession();

  const handleDelete = () => {
    startTransition(async () => {
      setOpenDeleteDialog(false);

      await deleteResourceType(resourceType.id)
        .then(async (data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);

            setTimeout(() => {
              revPath(resourceTypesTitle.href);
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
            resource: resourceTypesTitle.label.singular.toLowerCase(),
            resourceName: resourceType.name,
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
          <DropdownMenuItem onClick={handleCopy(resourceType.id)}>
            <CopyIcon /> Copy ID
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href={`${resourceTypesTitle.href}/${resourceType.id}`}>
              <AnvilIcon />
              Go to {resourceTypesTitle.label.singular.toLowerCase()}
            </Link>
          </DropdownMenuItem>

          {session && session.user.role !== UserRole.USER && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={`${resourceTypesTitle.href}/${resourceType.id}/edit`}
                >
                  <EditIcon />
                  Edit {resourceTypesTitle.label.singular.toLowerCase()}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setOpenDeleteDialog(true)}
              >
                <TrashIcon />
                Delete {resourceTypesTitle.label.singular.toLowerCase()}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default RowActions;
