import { Playthrough } from "@/core/cog/playthrough/types/playthrough";

export const buildingsAndCount = (playthrough: Playthrough) => {
  // Buildings
  const buildingsLength = playthrough.buildings.length;
  const buildingsCapacity = playthrough.buildings.reduce(
    (acc, curr) => acc + curr.size.capacity,
    0,
  );
  const buildingsUsed = playthrough.buildings.filter(
    (building) => building.backroom_id !== null,
  );
  const buildingsUsedLength = buildingsUsed.length;

  return {
    buildingsLength,
    buildingsCapacity,
    buildingsUsedLength,
  };
};
