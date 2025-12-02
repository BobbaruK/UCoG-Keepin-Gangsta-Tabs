import { GamblingFeatureType } from "@/generated/prisma";

export const gamblingFeatureColors = (type: GamblingFeatureType) => {
  switch (type) {
    case "ENHANCED":
      return "bg-accent-5";

    case "OCCASIONAL":
      return "bg-accent-1";

    case "REGULAR":
      return "bg-accent-3";

    default:
      return "bg-accent-5";
  }
};
