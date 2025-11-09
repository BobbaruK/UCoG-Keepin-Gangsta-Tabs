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
import { BATCH_ITEMS } from "@/constants/misc";
import { lawsTitle } from "@/constants/page-title/laws";
import { UserRole } from "@/generated/prisma";
import { useCustomCopyToClipboard } from "@/hooks/use-custom-copy-to-clipboard";
import { useSearchParams } from "@/hooks/use-search-params";
import { useSession } from "@/lib/auth-client";
import { chunkArray } from "@/lib/utils/chunk-array";
import { TableRowSelect } from "@/types/table-row-select";
import { TransitionStartFunction, useState } from "react";
import { toast } from "sonner";
import { deleteLaw } from "../../actions/delete";

interface Props {
  dataSelected: TableRowSelect;
  isLoading: boolean;
  startTransition: TransitionStartFunction;
}

const PaginationActions = ({
  dataSelected,
  isLoading,
  startTransition,
}: Props) => {
  const [{}, setSearchParams] = useSearchParams(startTransition);
  const { handleCopy } = useCustomCopyToClipboard();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { data: session } = useSession();

  const lawsData =
    dataSelected.type === "laws" && dataSelected.data ? dataSelected.data : [];

  const lawIdBatches = chunkArray(lawsData, BATCH_ITEMS);

  const handleDeleteLaws = () => {
    setOpenDeleteDialog(false);

    startTransition(async () => {
      for (const batch of lawIdBatches) {
        const results = (await Promise.allSettled(
          batch.map((trait) => deleteLaw(trait.id)),
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
        header={{
          title: {
            label: "Are you absolutely sure?",
          },
          description: `This action cannot be undone. This will permanently delete selected ${lawsTitle.label.singular.toLowerCase()}(s) and remove it's data from our servers.`,
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
              dataSelected?.data?.map((user) => user.id).join("\n") || "",
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
                Delete {lawsTitle.label.singular.toLowerCase()}(s)
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default PaginationActions;
