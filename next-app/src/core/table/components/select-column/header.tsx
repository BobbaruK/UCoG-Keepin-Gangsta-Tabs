import { Checkbox } from "@/components/ui/checkbox";
import { useSearchParams } from "@/hooks/use-search-params";
import { TransitionStartFunction } from "react";
import { useTableContext } from "../../providers/table-provider";

interface Props<T extends { id: string }> {
  data: T[];
  isLoading: boolean;
  startTransition: TransitionStartFunction;
}

export const SelectHeader = <T extends { id: string }>({
  data,
  isLoading,
  startTransition,
}: Props<T>) => {
  const [{ selected }, setSearchParams] = useSearchParams(startTransition);
  const { dataCount } = useTableContext();

  const dataIdArr = data?.map((row) => row.id);
  const isAllSelected = selected.length === dataCount;
  const isSomeSelected = selected.length > 0 && selected.length < dataCount;

  const handleSelect = () => {
    if (isAllSelected) {
      setSearchParams({ selected: null });
      return;
    }

    const addDataIdsArr: string[] = [];

    if (selected && dataIdArr)
      for (const id of dataIdArr)
        if (!selected.includes(id)) addDataIdsArr.push(id);

    if (!selected?.length) {
      setSearchParams((f) => ({
        selected: [...(f.selected || []), ...(dataIdArr || [])],
      }));

      return;
    }

    const newSelectedArr = selected?.concat(addDataIdsArr);

    setSearchParams({
      selected: newSelectedArr,
    });
  };

  return (
    <div className="flex h-9 items-center justify-center gap-2 p-0 text-inherit [&_svg]:size-3">
      <Checkbox
        checked={isAllSelected || (isSomeSelected && "indeterminate")}
        onCheckedChange={handleSelect}
        aria-label={`${isAllSelected ? "Deselect" : "Select"} all`}
        disabled={isLoading}
      />
    </div>
  );
};
