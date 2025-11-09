"use client";

import { cn } from "@/lib/utils";
import { CustomButton } from "./custom-button";
import { AddIcon } from "./icons/add";
import { MinusIcon } from "./icons/minus";
import { ResetIcon } from "./icons/reset";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  allowNegative?: boolean;
  emitClick: (value: number) => void;
  isPending?: boolean;
}

const Counter = ({
  value,
  allowNegative = false,
  emitClick,
  isPending,
  ...restProps
}: Props) => {
  const handleDecrease = (event: React.MouseEvent<HTMLButtonElement>) => {
    let output = value || 0;

    if (event.ctrlKey && event.shiftKey) {
      output -= 1000;
    } else if (event.shiftKey) {
      output -= 100;
    } else if (event.ctrlKey) {
      output -= 10;
    } else {
      output -= 1;
    }

    emitClick(allowNegative ? output : output < 0 ? 0 : output);
  };

  const handleIncrease = (event: React.MouseEvent<HTMLButtonElement>) => {
    let output = value || 0;

    if (event.ctrlKey && event.shiftKey) {
      output += 1000;
    } else if (event.shiftKey) {
      output += 100;
    } else if (event.ctrlKey) {
      output += 10;
    } else {
      output += 1;
    }

    emitClick(output);
  };

  return (
    <div
      {...restProps}
      className={cn("flex items-center gap-2", restProps.className)}
    >
      <CustomButton
        type="button"
        buttonLabel="Reset"
        onClick={() => emitClick(0)}
        icon={ResetIcon}
        iconPlacement="left"
        size={"icon"}
        skeletonClassName="size-9"
        disabled={isPending || value === 0}
      />

      <CustomButton
        type="button"
        buttonLabel="Decrease"
        onClick={handleDecrease}
        icon={MinusIcon}
        iconPlacement="left"
        size={"icon"}
        skeletonClassName="size-9"
        disabled={isPending}
      />

      <CustomButton
        type="button"
        buttonLabel="Increase"
        onClick={handleIncrease}
        icon={AddIcon}
        iconPlacement="left"
        size={"icon"}
        skeletonClassName="size-9"
        disabled={isPending}
      />
    </div>
  );
};

export default Counter;
