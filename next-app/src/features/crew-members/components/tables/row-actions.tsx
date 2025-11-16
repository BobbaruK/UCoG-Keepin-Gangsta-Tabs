"use client";

import { CustomButton } from "@/components/custom-button";
import { EditIcon } from "@/components/icons/edit";
import { TrashIcon } from "@/components/icons/trash";
import ResponsiveDialog from "@/components/responsive-dialog";
import { MESSAGES } from "@/constants/messages";
import { crewMembersTitle } from "@/constants/page-title/crew-members";
import { Suspense, useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteCrewMember } from "../../actions/member/delete";
import { CaptainRole } from "../../types/captain-role";
import { CrewMember } from "../../types/crew-member";
import { CrewLevel } from "../../types/level";
import { Nationality } from "../../types/nationality";
import { Trait } from "../../types/traits";
import EditMemberMultiStep from "../edit-member-multistep";
// const EditPoliceOfficerForm = lazy(() => import("../form/edit"));

interface Props {
  crewMember: CrewMember;
  roles: CaptainRole[] | undefined;
  nationalities: Nationality[] | undefined;
  traits: Trait[] | undefined;
  levels: CrewLevel[] | undefined;
}

const RowActions = ({
  crewMember,
  roles,
  nationalities,
  traits,
  levels,
}: Props) => {
  const [isPending, startTransition] = useTransition();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditCrewMember, setOpenEditCrewMember] = useState(false);

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
    <div className="flex items-center gap-2">
      <ResponsiveDialog
        open={openEditCrewMember}
        setOpen={setOpenEditCrewMember}
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
            label: `Edit ${crewMembersTitle.label.singular.toLowerCase()}`,
          },
        }}
      >
        <Suspense fallback={<p>Loading</p>}>
          <EditMemberMultiStep
            crewMember={crewMember}
            playthroughId={crewMember.playthrough.id}
            roles={roles}
            nationalities={nationalities}
            traits={traits}
            levels={levels}
            editCrewMemberDialog={() => setOpenEditCrewMember(false)}
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
          description: `This action cannot be undone. This will permanently delete this ${crewMembersTitle.label.singular.toLowerCase()} and remove it's data from our servers.`,
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
