import { GamblingBuilding } from "../../gambling-building/types/gambling-building";

export const weeklyCostCalculator = (gamblingBuilding: GamblingBuilding) => {
  const totalWeeklyCost = gamblingBuilding.features.reduce(
    (acc, curr) => acc + curr.weekly_cost,
    0,
  );
  let percentage = 0;

  const organizedTrait = gamblingBuilding.manager.traits.find((trait) =>
    trait.name.toLowerCase().includes("organized"),
  );

  // Organized - Trait
  if (organizedTrait) percentage += 0.1;

  const latestLightings = gamblingBuilding.features.find((feature) =>
    feature.name.toLowerCase().includes("latest"),
  );

  // Latest lightings - Gambling feature
  if (latestLightings) percentage += 0.2;

  // House manager - crew level
  const houseManagerLevel = gamblingBuilding.manager.experience.find(
    (experience) =>
      experience.level.name.toLowerCase().includes("house manager"),
  );

  if (houseManagerLevel && houseManagerLevel.value === 1) percentage += 0.1;
  if (houseManagerLevel && houseManagerLevel.value === 2) percentage += 0.2;
  if (houseManagerLevel && houseManagerLevel.value === 3) percentage += 0.25;
  if (houseManagerLevel && houseManagerLevel.value === 4) percentage += 0.5;

  return {
    totalWeeklyCost,
    percentage,
    organizedTrait,
    latestLightings,
    houseManagerLevel,
  };
};
