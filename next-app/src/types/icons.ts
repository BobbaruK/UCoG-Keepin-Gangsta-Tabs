import { LucideProps } from "lucide-react";
import { IconBaseProps } from "react-icons/lib";

export type LucideIconProps = Omit<LucideProps, "ref"> &
  React.RefAttributes<SVGSVGElement>;

export type ReactIconsProps = IconBaseProps;
