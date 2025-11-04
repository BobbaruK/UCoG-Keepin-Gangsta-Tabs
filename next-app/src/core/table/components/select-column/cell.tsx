"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useSearchParams } from "@/hooks/use-search-params";
import { TransitionStartFunction } from "react";

interface Props {
  id: string;
  isLoading: boolean;
  startTransition: TransitionStartFunction;
}

export const SelectCell = ({ id, isLoading, startTransition }: Props) => {
  const [{ selected }, setSearchParams] = useSearchParams(startTransition);

  const handleCheckChange = () => {
    if (selected?.includes(id)) {
      const filtered = selected.filter((feat) => feat !== id);

      setSearchParams({
        selected: filtered.length > 0 ? filtered : null,
      });

      return;
    }

    setSearchParams((f) => ({
      selected: [...(f.selected || []), id],
    }));
  };
  return (
    <div className="grid place-items-center p-2">
      <Checkbox
        onCheckedChange={handleCheckChange}
        checked={selected?.includes(id)}
        disabled={isLoading}
      />
    </div>
  );
};
