import { CustomButton } from "@/components/custom-button";
import { ErrorIcon } from "@/components/icons/error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DEBOUNCE_DEFAULT } from "@/constants/misc";
import { useSearchParams } from "@/hooks/use-search-params";
import { TransitionStartFunction, useRef } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { useTableContext } from "../providers/table-provider";

export const SearchField = () => {
  const { showSearchSwitch, isLoading, startTransition } = useTableContext();
  const [{ search, searchBy }, setSearchParams] =
    useSearchParams(startTransition);
  const searchElRef = useRef<HTMLInputElement>(null);
  const debounced = useDebounceCallback((search: string | null) => {
    setSearchParams({
      search: search || null,
      pageIndex: 0,
    });
  }, DEBOUNCE_DEFAULT);

  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder={`Search by ${searchBy === "name" ? "name" : "email"}`}
        onChange={(e) => {
          debounced(e.target.value);
        }}
        defaultValue={search || ""}
        ref={searchElRef}
        className="max-w-sm"
      />
      {search && (
        <>
          <CustomButton
            buttonLabel="Reset search field"
            variant={"outline"}
            icon={ErrorIcon}
            iconPlacement="left"
            size={"icon"}
            className="size-9 min-w-9"
            skeletonClassName="size-9 min-w-9"
            onClick={() => {
              const el = searchElRef.current as HTMLInputElement;
              // debounced(null);
              setSearchParams({ search: null });
              el.value = "";
              el.focus();
            }}
          />
        </>
      )}
      {showSearchSwitch && (
        <SwitchSearch isLoading={isLoading} startTransition={startTransition} />
      )}
    </div>
  );
};

function SwitchSearch({
  isLoading,
  startTransition,
}: {
  isLoading: boolean;
  startTransition: TransitionStartFunction;
}) {
  const [{ searchBy }, setSearchParams] = useSearchParams(startTransition);

  return (
    <div className="flex items-center gap-2">
      <Switch
        className=""
        checked={
          searchBy === "name" ? false : searchBy === "email" ? true : false
        }
        onCheckedChange={() =>
          setSearchParams({
            searchBy:
              searchBy === "name"
                ? "email"
                : searchBy === "email"
                  ? "name"
                  : "name",
            pageIndex: 0,
          })
        }
        disabled={isLoading}
        id="search-switch"
      />
      <Label htmlFor="search-switch">Email</Label>
    </div>
  );
}
