"use client";

import { CustomButton } from "@/components/custom-button";
import { AccountIcon } from "@/components/icons/account";
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
import { MESSAGES } from "@/constants/messages";
import { sideEffectsTitle } from "@/constants/page-title/side-effects";
import { deleteSideEffect } from "@/features/side-effects/actions/delete";
import { cog_side_effect, UserRole } from "@/generated/prisma";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";

interface Props {
  sideEffect: cog_side_effect;
}

const RowActions = ({ sideEffect }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [copiedText, copy] = useCopyToClipboard();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { data: session } = useSession();

  const handleCopy = (text: string) => () => {
    if (!text) {
      toast.error("Nothing to copy");
      return;
    }

    copy(text)
      .then(() => {
        toast.success("Copied side effect ID.", {
          description: text,
        });
      })
      .catch((error) => {
        if (error instanceof Error) console.error(error.message);

        toast.error("Failed to copy!");
      });
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deleteSideEffect(sideEffect.id)
        .then(async (data) => {
          if (data.error) {
            toast.error(data.error);
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
        header={{
          title: {
            label: "Are you absolutely sure?",
          },
          description: `This action cannot be undone. This will permanently delete this ${sideEffectsTitle.label.singular.toLowerCase()} and remove it's data from our servers.`,
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
          <DropdownMenuItem onClick={handleCopy(sideEffect.id)}>
            <CopyIcon /> Copy ID
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href={`${sideEffectsTitle.href}/${sideEffect.id}`}>
              <AccountIcon />
              Go to side effect
            </Link>
          </DropdownMenuItem>

          {session && session.user.role !== UserRole.USER && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`${sideEffectsTitle.href}/${sideEffect.id}/edit`}>
                  <EditIcon />
                  Edit {sideEffectsTitle.label.singular.toLowerCase()}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setOpenDeleteDialog(true)}
              >
                <TrashIcon />
                Delete {sideEffectsTitle.label.singular.toLowerCase()}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default RowActions;
