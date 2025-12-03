import { GamblingFeatureType } from "@/generated/prisma";
import { cn } from "@/lib/utils";

export const gamblingFeatureColors = (
  {
    type,
    noHover,
  }: {
    type: GamblingFeatureType;
    noHover?: boolean;
  } = {
    type: "ENHANCED",
    noHover: false,
  },
) => {
  const enhanced = cn(
    "bg-performance-enhancers! text-performance-enhancers-foreground!",
    noHover
      ? ""
      : "hover:bg-performance-enhancers/20! hover:border-performance-enhancers hover:text-performance-enhancers!",
  );
  const occasional = cn(
    "bg-occasional-gamblers! text-occasional-gamblers-foreground!",
    noHover
      ? ""
      : "hover:bg-occasional-gamblers/20! hover:border-occasional-gamblers hover:text-occasional-gamblers!",
  );
  const regular = cn(
    "bg-regular-gamblers! text-regular-gamblers-foreground!",
    noHover
      ? ""
      : "hover:bg-regular-gamblers/20! hover:border-regular-gamblers hover:text-regular-gamblers!",
  );

  switch (type) {
    case "ENHANCED":
      return enhanced;

    case "OCCASIONAL":
      return occasional;

    case "REGULAR":
      return regular;

    default:
      return enhanced;
  }
};
