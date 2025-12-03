"use client";

import { revPath } from "@/actions/revalidate";
import { CustomButton } from "@/components/custom-button";
import { CrewMemberIcon } from "@/components/icons/crew-member";
import { TrashIcon } from "@/components/icons/trash";
import ResponsiveDialog from "@/components/responsive-dialog";
import { DIALOG_MESSAGES, MESSAGES } from "@/constants/messages";
import { crewMembersTitle } from "@/constants/page-title/crew-members";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { CrewMember } from "@/core/cog/crew-member/types/crew-member";
import RowActionDropdown from "@/core/table/components/row-action-dropdown";
import { useSession } from "@/lib/auth-client";
import { setFullName } from "@/lib/utils/full-name";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteCrewMember } from "../../actions/member/delete";

interface Props {
  crewMember: CrewMember;
}

const RowActions = ({ crewMember }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { data: session } = useSession();

  const handleDelete = () => {
    startTransition(async () => {
      setOpenDeleteDialog(false);

      await deleteCrewMember(crewMember)
        .then(async (data) => {
          if (data.error) {
            toast.error(data.error);
            setOpenDeleteDialog(false);
          }
          if (data.success) {
            toast.success(data.success);

            setTimeout(() => {
              revPath(
                `${playthroughTitle.href}/${crewMember.playthrough.id + crewMembersTitle.href}`,
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
            resource: crewMembersTitle.label.singular.toLowerCase(),
            resourceName: setFullName({
              firstName: crewMember.first_name,
              lastName: crewMember.last_name,
              alias: crewMember.alias,
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

      <RowActionDropdown
        id={crewMember.id}
        resourceName={
          setFullName({
            firstName: crewMember.first_name,
            lastName: crewMember.last_name,
            alias: crewMember.alias,
          }).outputFE
        }
        goTo={{
          href: `${playthroughTitle.href}/${crewMember.cog_playthroughId + crewMembersTitle.href}/${crewMember.id}`,
          icon: CrewMemberIcon,
        }}
        showEditDelete={
          (session &&
            crewMember.auth_userId === session.user.id &&
            !crewMember.playthrough.is_finished) ||
          false
        }
        editHref={`${playthroughTitle.href}/${crewMember.cog_playthroughId + crewMembersTitle.href}/${crewMember.id}/edit`}
        isPending={isPending}
        setOpenDeleteDialog={setOpenDeleteDialog}
      />
    </>
  );
};

export default RowActions;
