import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function PublicAuthLayout({ children }: Props) {
  return (
    <div className="flex min-h-dvh items-center justify-center">{children}</div>
  );
}
