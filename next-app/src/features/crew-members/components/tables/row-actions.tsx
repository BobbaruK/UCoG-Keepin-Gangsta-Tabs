"use client";

import { CustomButton } from "@/components/custom-button";
import { CopyIcon } from "@/components/icons/copy";
import { CrewIcon } from "@/components/icons/crew";
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
import { crewMembersTitle } from "@/constants/page-title/crew-members";
import { UserRole } from "@/generated/prisma";
import { useCustomCopyToClipboard } from "@/hooks/use-custom-copy-to-clipboard";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteCrewMember } from "../../actions/member/delete";
import { CrewMember } from "../../types/crew-member";
import { playthroughTitle } from "@/constants/page-title/playthrough";
// const EditPoliceOfficerForm = lazy(() => import("../form/edit"));

interface Props {
  crewMember: CrewMember;
}

const RowActions = ({ crewMember }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { handleCopy } = useCustomCopyToClipboard();
  const { data: session } = useSession();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteCrewMember(crewMember.id)
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
          description: `This action cannot be undone. This will permanently delete this ${crewMembersTitle.label.singular.toLowerCase()} and remove it's data from our servers.`,
        }}
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
          <DropdownMenuItem onClick={handleCopy(crewMember.id)}>
            <CopyIcon /> Copy ID
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href={`${playthroughTitle.href}/${crewMember.playthrough.id + crewMembersTitle.href}/${crewMember.id}`}
            >
              <CrewIcon />
              Go to {crewMembersTitle.label.singular.toLowerCase()}
            </Link>
          </DropdownMenuItem>

          {session && session.user.role !== UserRole.USER && (
            <>
              <DropdownMenuSeparator />

              {!crewMember.playthrough.is_finished && (
                <>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`${playthroughTitle.href}/${crewMember.playthrough.id + crewMembersTitle.href}/${crewMember.id}/edit`}
                    >
                      <EditIcon />
                      Edit {crewMembersTitle.label.singular.toLowerCase()}
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
                Delete {crewMembersTitle.label.singular.toLowerCase()}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default RowActions;
