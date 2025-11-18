"use client";

import { CustomButton } from "@/components/custom-button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PAGINATION_DEFAULT } from "@/constants/table";
import { useTableContext } from "@/core/table/providers/table-provider";
import { useSearchParams } from "@/hooks/use-search-params";
import { cn } from "@/lib/utils";
import {
  Column,
  ColumnDef,
  ColumnPinningState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { CSSProperties, ReactNode, useState } from "react";
import { DataTablePagination } from "./pagination";
import { SearchField } from "./search-field";

const getCommonPinningStyles = <TData,>(
  column: Column<TData>,
): CSSProperties => {
  // console.log({ column: column.getSize() });

  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === "left" && column.getIsLastColumn("left");
  const isFirstRightPinnedColumn =
    isPinned === "right" && column.getIsFirstColumn("right");

  return {
    boxShadow: isLastLeftPinnedColumn
      ? "-4px 0 4px -4px gray inset"
      : isFirstRightPinnedColumn
        ? "4px 0 4px -4px gray inset"
        : undefined,
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    opacity: isPinned ? 0.95 : 1,
    position: isPinned ? "sticky" : "relative",
    minWidth: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  };
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  columnVisibilityObj?: VisibilityState;
  columnPinning?: ColumnPinningState;
  legendItems?: ReactNode;
  showSearch?: boolean;
  showColumnSelector?: boolean;
  showPagination?: boolean;
  legendFooter?: "and" | "or";
  advancedFiltering?: ReactNode;
  twSkeletonHeightCell?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  columnVisibilityObj,
  columnPinning,
  legendItems,
  showSearch = true,
  showColumnSelector = true,
  showPagination = true,
  legendFooter = undefined,
  advancedFiltering,
  twSkeletonHeightCell,
}: DataTableProps<TData, TValue>) {
  "use no memo"; // TODO: check out for tanstack query v9 or compatibility with react forget (compiler)

  const { dataCount, isLoading, startTransition } = useTableContext();
  const [{ pageSize }] = useSearchParams(startTransition);

  // Table related states
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    columnVisibilityObj || {},
  );

  // TODO: check out for tanstack query v9 or compatibility with react forget (compiler)
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    enableColumnPinning: true,
    // columnResizeMode: "onChange",
    state: {
      columnVisibility,
    },
    initialState: {
      columnPinning,
    },
    // defaultColumn: {
    //   size: 200, //starting column size
    //   minSize: 60, //enforced during column resizing
    //   maxSize: 500, //enforced during column resizing
    // },
  });

  return (
    <div className="w-full rounded-md">
      {(showSearch || showColumnSelector) && (
        <div className="flex items-center gap-4 pb-4">
          {showSearch !== false && <SearchField />}

          {showColumnSelector !== false && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <CustomButton
                  buttonLabel={`Columns`}
                  variant={"outline"}
                  className="ml-auto"
                  skeletonClassName="ml-auto w-[90px] h-9"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="truncate"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.columnDef.meta?.label ?? column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}

      {advancedFiltering}

      {(legendFooter === "and" || legendFooter === undefined) && legendItems}

      <div className="flex flex-col overflow-hidden rounded-md border">
        <div className={cn({ "border-b": showPagination !== false })}>
          <Table
            style={{
              // width: table.getTotalSize(),
              width: "100%",
            }}
          >
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const { column } = header;

                    return (
                      <TableHead
                        key={header.id}
                        className="bg-primary text-primary-foreground"
                        style={{
                          ...getCommonPinningStyles<TData>(column),
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                        {/* {column.getSize()} */}
                        {/* <div
                          className={cn(
                            "bg-primary hover:bg-muted absolute top-0 right-0 h-full w-1 cursor-col-resize touch-none",
                            header.column.getIsResizing()
                              ? "bg-blue-700 opacity-100"
                              : "",
                          )}
                          onDoubleClick={() => header.column.resetSize()}
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                        /> */}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <>
                  {Array.from({
                    length:
                      pageSize <= PAGINATION_DEFAULT
                        ? dataCount && dataCount <= pageSize
                          ? dataCount
                          : pageSize
                        : PAGINATION_DEFAULT,
                  }).map((_, index) => (
                    <TableRow key={index} className="h-[65px]">
                      {table.getRowModel().rows[0]
                        ? table
                            .getRowModel()
                            .rows[0].getVisibleCells()
                            .map((cell) => {
                              const { column } = cell;

                              return (
                                <TableCell
                                  key={cell.id}
                                  className={cn(`p-2 ${twSkeletonHeightCell}`)}
                                  style={{
                                    ...getCommonPinningStyles<TData>(column),
                                  }}
                                >
                                  <Skeleton className="h-4 w-full" />
                                </TableCell>
                              );
                            })
                        : // TODO: check this shit out if needed multiple rows in the table heads
                          table.getHeaderGroups()[0].headers.map((header) => {
                            return (
                              <TableCell
                                key={header.id}
                                className={twSkeletonHeightCell}
                              >
                                <Skeleton className="h-4 w-[100px]" />
                              </TableCell>
                            );
                          })}
                    </TableRow>
                  ))}
                </>
              ) : (
                <>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="hover:[&>td]:bg-muted"
                      >
                        {row.getVisibleCells().map((cell) => {
                          const { column } = cell;

                          return (
                            <TableCell
                              key={cell.id}
                              className="bg-background"
                              style={{
                                ...getCommonPinningStyles<TData>(column),
                              }}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </div>
        {showPagination !== false && (
          <div className="p-2">
            <DataTablePagination />
          </div>
        )}
      </div>
      {legendFooter && legendItems}
    </div>
  );
}
