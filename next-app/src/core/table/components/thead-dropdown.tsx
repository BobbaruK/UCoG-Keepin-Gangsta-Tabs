"use client";

import { ChevronDownIcon } from "@/components/icons/chevron-down";
import { ChevronLeftIcon } from "@/components/icons/chevron-left";
import { ChevronRightIcon } from "@/components/icons/chevron-right";
import { ChevronUpIcon } from "@/components/icons/chevron-up";
import { ResetIcon } from "@/components/icons/reset";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSearchParams } from "@/hooks/use-search-params";
import { cn } from "@/lib/utils";
import { Column } from "@tanstack/react-table";
import { TransitionStartFunction } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { LuChevronsUpDown } from "react-icons/lu";

interface Props<T> {
  id: string;
  label: string;
  isLoading: boolean;
  startTransition: TransitionStartFunction;
  column: Column<T>;
}

export const THeadDropdown = <T,>({
  id,
  label,
  isLoading,
  startTransition,
  column,
}: Props<T>) => {
  const [{ sort, sortBy }, setSearchParams] = useSearchParams(startTransition);

  if (column.getCanSort() || column.getCanPin())
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"link"}
            size={"sm"}
            className={cn(
              "flex items-center justify-start gap-2 p-0 text-inherit",
              sortBy === id ? "underline underline-offset-8" : "",
            )}
            disabled={isLoading}
          >
            {label}

            {!isLoading && (
              <>
                {sort === "asc" && sortBy === id && <FaChevronUp />}
                {sort === "desc" && sortBy === id && <FaChevronDown />}
                {(sort === null || sortBy !== id) && <LuChevronsUpDown />}
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {column.getCanSort() && (
            <>
              <DropdownMenuItem
                className={cn("[&>svg]:size-3")}
                onClick={() =>
                  setSearchParams({
                    sortBy: id,
                    sort: "asc",
                    pageIndex: 0,
                  })
                }
                disabled={sort === "asc" && sortBy === id}
              >
                <ChevronUpIcon /> Asc
              </DropdownMenuItem>
              <DropdownMenuItem
                className="[&>svg]:size-3"
                onClick={() =>
                  setSearchParams({
                    sortBy: id,
                    sort: "desc",
                    pageIndex: 0,
                  })
                }
                disabled={sort === "desc" && sortBy === id}
              >
                <ChevronDownIcon /> Desc
              </DropdownMenuItem>
              {sort !== null && sortBy === id && (
                <DropdownMenuItem
                  className="[&>svg]:size-3"
                  onClick={() =>
                    setSearchParams({
                      sortBy: null,
                      sort: null,
                      pageIndex: 0,
                    })
                  }
                >
                  <ResetIcon /> Reset
                </DropdownMenuItem>
              )}
            </>
          )}
          {column.getCanSort() && column.getCanPin() && (
            <DropdownMenuSeparator />
          )}
          {column.getCanPin() && (
            <>
              <DropdownMenuItem
                className="[&>svg]:size-10"
                onClick={() => column.pin("left")}
                disabled={column.getIsPinned() === "left"}
              >
                <ChevronLeftIcon />
                Pin left
              </DropdownMenuItem>
              <DropdownMenuItem
                className="[&>svg]:size-10"
                onClick={() => column.pin("right")}
                disabled={column.getIsPinned() === "right"}
              >
                <ChevronRightIcon />
                Pin right
              </DropdownMenuItem>
              {column.getIsPinned() && (
                <DropdownMenuItem
                  className="[&>svg]:size-10"
                  onClick={() => column.pin(false)}
                >
                  <ResetIcon />
                  Cancel pin
                </DropdownMenuItem>
              )}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );

  return (
    <div
      className={cn(
        "flex h-9 items-center justify-start gap-2 p-0 text-inherit",
      )}
    >
      {label}
    </div>
  );
};
