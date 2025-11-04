import { ReactNode } from "react";

export type Trigger = {
  hidden?: boolean;
  // asChild?: boolean;
} & (
  | {
      type: "label";
      label: string;
    }
  | {
      type: "element";
      element: ReactNode;
    }
);

export type Header = {
  title: Title;
  description?: string;
};

export type Title = {
  label: string;
};
