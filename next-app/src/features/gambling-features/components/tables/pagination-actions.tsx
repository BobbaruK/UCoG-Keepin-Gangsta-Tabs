"use client";

import { CustomButton } from "@/components/custom-button";
import { CopyIcon } from "@/components/icons/copy";
import { TrashIcon } from "@/components/icons/trash";
import ResponsiveDialog from "@/components/responsive-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DIALOG_MESSAGES } from "@/constants/messages";
import { BATCH_ITEMS } from "@/constants/misc";
import { gamblingFeatureTitle } from "@/constants/page-title/gambling-feature";
import { GamblingFeature } from "@/core/cog/gambling-feature/types/gambling-feature";
import { useTableContext } from "@/core/table/providers/table-provider";
import { UserRole } from "@/generated/prisma";
import { useCustomCopyToClipboard } from "@/hooks/use-custom-copy-to-clipboard";
import { useSearchParams } from "@/hooks/use-search-params";
import { useSession } from "@/lib/auth-client";
import { chunkArray } from "@/lib/utils/chunk-array";
import { useState } from "react";
import { toast } from "sonner";
import { deleteGamblingFeature } from "../../actions/delete";

const PaginationActions = () => {
  const { isLoading, startTransition, dataSelected } =
    useTableContext<GamblingFeature>();
  const [{}, setSearchParams] = useSearchParams(startTransition);
  const { handleCopy } = useCustomCopyToClipboard();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { data: session } = useSession();

  const gamblingSizeIdBatches = chunkArray(dataSelected, BATCH_ITEMS);

  const handleDeleteLaws = () => {
    setOpenDeleteDialog(false);

    startTransition(async () => {
      for (const batch of gamblingSizeIdBatches) {
        const results = (await Promise.allSettled(
          batch.map((gamblingFeature) =>
            deleteGamblingFeature(gamblingFeature.id),
          ),
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

      setSearchParams({
        selected: [],
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
              disabled={isLoading}
              onClick={() => setOpenDeleteDialog(true)}
            />
          ),
          hidden: true,
        }}
        header={
          DIALOG_MESSAGES({
            resource: gamblingFeatureTitle.label.singular.toLowerCase(),
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
            onClick={handleDeleteLaws}
          />
        </div>
      </ResponsiveDialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <CustomButton
            buttonLabel="Actions"
            size={"sm"}
            variant={"outline"}
            className="h-8"
            skeletonClassName="w-[73px] h-8"
            disabled={isLoading}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={handleCopy(
              dataSelected.map((user) => user.id).join("\n") || "",
            )}
          >
            <CopyIcon />
            Copy id(s)
          </DropdownMenuItem>
          {session && session.user.role !== UserRole.USER && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setOpenDeleteDialog(true)}
              >
                <TrashIcon />
                Delete {gamblingFeatureTitle.label.singular.toLowerCase()}(s)
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default PaginationActions;
