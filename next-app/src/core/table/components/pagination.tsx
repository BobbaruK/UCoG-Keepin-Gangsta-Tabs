"use client";

import { CustomButton } from "@/components/custom-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PAGINATION_ARR } from "@/constants/table";
import { useSearchParams } from "@/hooks/use-search-params";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { useTableContext } from "../providers/table-provider";

export function DataTablePagination() {
  const { dataCount, isLoading, startTransition, paginationActions } =
    useTableContext();
  const [{ pageSize, pageIndex, selected }, setSearchParams] =
    useSearchParams(startTransition);

  const totalPages = Math.ceil(dataCount / pageSize);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {isLoading ? (
            <Skeleton className="h-5 w-40" />
          ) : selected.length > 0 ? (
            `${selected.length} of ${dataCount} row(s) selected`
          ) : (
            `${dataCount} row(s)`
          )}
        </div>

        {selected.length > 0 && paginationActions}
      </div>

      <div className="flex flex-wrap items-center gap-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              setSearchParams({
                pageSize: parseInt(value),
                pageIndex: 0,
              });
            }}
            disabled={isLoading}
          >
            <SelectTrigger className="h-8 w-20">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {PAGINATION_ARR.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {pageIndex + 1} of {totalPages}
        </div>
        <div className="flex flex-wrap items-center space-x-2">
          <CustomButton
            buttonLabel="Go to first page"
            variant="outline"
            icon={MdKeyboardDoubleArrowLeft}
            iconPlacement="left"
            size={"icon"}
            className="size-8 h-8 w-8 min-w-fit p-0 lg:flex"
            skeletonClassName="size-8 h-8 w-8 min-w-fit p-0 lg:flex"
            onClick={() => {
              setSearchParams({ pageIndex: 0 });
            }}
            disabled={isLoading || pageIndex === 0}
          />
          <CustomButton
            buttonLabel="Go to previous page"
            variant="outline"
            icon={FaChevronCircleLeft}
            iconPlacement="left"
            size={"icon"}
            className="size-8 h-8 w-8 min-w-fit p-0 lg:flex"
            skeletonClassName="size-8 h-8 w-8 min-w-fit p-0 lg:flex"
            onClick={() => {
              setSearchParams({ pageIndex: pageIndex - 1 });
            }}
            disabled={isLoading || pageIndex === 0}
          />
          <CustomButton
            buttonLabel="Go to next page"
            variant="outline"
            icon={FaChevronCircleRight}
            iconPlacement="left"
            size={"icon"}
            className="size-8 h-8 w-8 min-w-fit p-0 lg:flex"
            skeletonClassName="size-8 h-8 w-8 min-w-fit p-0 lg:flex"
            onClick={() => {
              setSearchParams({ pageIndex: pageIndex + 1 });
            }}
            disabled={isLoading || pageIndex >= totalPages - 1}
          />
          <CustomButton
            buttonLabel="Go to last page"
            variant="outline"
            icon={MdKeyboardDoubleArrowRight}
            iconPlacement="left"
            size={"icon"}
            className="size-8 h-8 w-8 min-w-fit p-0 lg:flex"
            skeletonClassName="size-8 h-8 w-8 min-w-fit p-0 lg:flex"
            onClick={() => {
              setSearchParams({ pageIndex: totalPages - 1 });
            }}
            disabled={isLoading || pageIndex >= totalPages - 1}
          />
        </div>
      </div>
    </div>
  );
}
