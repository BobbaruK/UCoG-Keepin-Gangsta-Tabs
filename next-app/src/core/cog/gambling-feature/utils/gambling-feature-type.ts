import { GamblingFeatureType } from "@/generated/prisma";

export const gamblingFeatureTypes = (
  gamblingFeatureType: GamblingFeatureType,
) => {
  switch (gamblingFeatureType) {
    case "ENHANCED":
      return "Performance enhancers";

    case "OCCASIONAL":
      return "Occasional gamblers";

    case "REGULAR":
      return "Regular gamblers";

    default:
      return "Regular gamblers *";
  }
};
