import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const PageStructure = ({ children }: Props) => {
  return <div className="container space-y-6 py-4 md:py-6">{children}</div>;
};
