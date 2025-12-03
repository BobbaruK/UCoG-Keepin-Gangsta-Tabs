import { weeklyCostCalculator } from "@/core/cog/gambling-feature/utils/weekly-cost-calculator";
import { Playthrough } from "@/core/cog/playthrough/types/playthrough";

export const gamblingBuildingsAndCount = (playthrough: Playthrough) => {
  // Gambling
  const gamblingLength = playthrough.gambling_buildings.length;
  const gamblingWeeklyCosts = playthrough.gambling_buildings.reduce(
    (acc, curr) => {
      const { totalWeeklyCost, percentage } = weeklyCostCalculator(curr);

      return acc + (totalWeeklyCost - totalWeeklyCost * percentage);
    },
    0,
  );
  const gamblingCashOnHand = playthrough.gambling_buildings.reduce(
    (acc, curr) =>
      acc + curr.features.reduce((acc, curr) => acc + curr.cash_on_hand, 0),
    0,
  );

  return {
    gamblingLength,
    gamblingWeeklyCosts,
    gamblingCashOnHand,
  };
};
