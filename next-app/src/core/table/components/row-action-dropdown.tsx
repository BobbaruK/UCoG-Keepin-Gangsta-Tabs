"use client";

import { CustomButton } from "@/components/custom-button";
import { CopyIcon } from "@/components/icons/copy";
import { EditIcon } from "@/components/icons/edit";
import { MoreIcon } from "@/components/icons/more";
import { TrashIcon } from "@/components/icons/trash";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCustomCopyToClipboard } from "@/hooks/use-custom-copy-to-clipboard";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

interface Props {
  id: string;
  resourceName: string;
  goTo: {
    href: string;
    icon: React.ElementType;
  };
  showEditDelete: boolean;
  editHref: string;
  isPending: boolean;
  setOpenDeleteDialog: Dispatch<SetStateAction<boolean>>;
}

const RowActionDropdown = ({
  id,
  resourceName,
  goTo,
  showEditDelete,
  editHref,
  isPending,
  setOpenDeleteDialog,
}: Props) => {
  const { handleCopy } = useCustomCopyToClipboard();

  return (
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
        <DropdownMenuItem onClick={handleCopy(id)}>
          <CopyIcon /> Copy ID
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={goTo.href}>
            <goTo.icon />
            Go to
            <span className="max-w-[120px] truncate font-medium">
              {resourceName}
            </span>
          </Link>
        </DropdownMenuItem>

        {showEditDelete && (
          <>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href={editHref}>
                <EditIcon />
                Edit
                <span className="max-w-[120px] truncate font-medium">
                  {resourceName}
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
              <span className="max-w-[120px] truncate font-medium">
                {resourceName}
              </span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RowActionDropdown;
