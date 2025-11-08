"use client";

import { CustomButton } from "./custom-button";
import { AddIcon } from "./icons/add";
import { MinusIcon } from "./icons/minus";

interface Props {
  value: number;
  emitClick: (value: number) => void;
}

const Counter = ({ value, emitClick }: Props) => {
  const handleDecrease = (e: React.MouseEvent<HTMLButtonElement>) => {
    let output = value;

    if (e.ctrlKey && e.shiftKey) {
      output -= 1000;
    } else if (e.ctrlKey) {
      output -= 10;
    } else if (e.shiftKey) {
      output -= 100;
    } else {
      output -= 1;
    }

    emitClick(output);
  };

  const handleIncrease = (e: React.MouseEvent<HTMLButtonElement>) => {
    let output = value;

    if (e.ctrlKey && e.shiftKey) {
      output += 1000;
    } else if (e.ctrlKey) {
      output += 10;
    } else if (e.shiftKey) {
      output += 100;
    } else {
      output += 1;
    }

    emitClick(output);
  };

  return (
    <div className="flex items-center gap-2">
      <CustomButton
        type="button"
        buttonLabel="Decrease"
        onClick={handleDecrease}
        icon={MinusIcon}
        iconPlacement="left"
        size={"icon"}
        skeletonClassName="size-9"
      />
      <CustomButton
        type="button"
        buttonLabel="Increase"
        onClick={handleIncrease}
        icon={AddIcon}
        iconPlacement="left"
        size={"icon"}
        skeletonClassName="size-9"
      />
    </div>
  );
};

export default Counter;
