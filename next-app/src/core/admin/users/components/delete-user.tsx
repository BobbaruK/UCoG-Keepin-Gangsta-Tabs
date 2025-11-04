"use client";

import { CustomButton } from "@/components/custom-button";
import { TrashIcon } from "@/components/icons/trash";
import { BATCH_ITEMS } from "@/constants/misc";
import { removeUser } from "@/core/admin/users/actions/remove-user";
import { chunkArray } from "@/lib/utils/chunk-array";
import { UserSession } from "@/types/session";
import { Dispatch, SetStateAction, TransitionStartFunction } from "react";
import { toast } from "sonner";

interface Props {
  users: UserSession[];
  isLoading: boolean;
  startTransition: TransitionStartFunction;
  setOpenDeleteDialog?: Dispatch<SetStateAction<boolean>>;
}

const DeleteUser = ({
  users,
  isLoading,
  startTransition,
  setOpenDeleteDialog,
}: Props) => {
  const usersBatches = chunkArray(users, BATCH_ITEMS);

  const handleDeleteUser = () => {
    setOpenDeleteDialog?.(false);

    startTransition(async () => {
      for (const batch of usersBatches) {
        const results = (await Promise.allSettled(
          batch.map((user) => removeUser(user)),
        )) as {
          status: string;
          value: {
            error?: string;
            success?: string;
          };
        }[];

        for (const result of results) {
          if (result.value.error) toast.error(result.value.error);
          if (result.value.success) toast.success(result.value.success);
        }

        await new Promise((r) => setTimeout(r, 200));
      }
    });
  };

  return (
    <div className="flex items-center justify-end gap-4">
      <CustomButton
        buttonLabel="Delete user(s)"
        variant={"danger"}
        icon={TrashIcon}
        iconPlacement="left"
        hideLabelOnMobile={false}
        onClick={handleDeleteUser}
        disabled={isLoading}
      />

      <CustomButton
        buttonLabel="Cancel"
        variant={"outline"}
        onClick={() => setOpenDeleteDialog?.(false)}
        disabled={isLoading}
      />
    </div>
  );
};

export default DeleteUser;
