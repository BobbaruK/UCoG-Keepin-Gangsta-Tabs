import { Playthrough } from "@/core/cog/playthrough/types/playthrough";

export const autoRoutesAndCount = (playthrough: Playthrough) => {
  // Auto routes
  const autoRoutesLength = playthrough.auto_routes.length;
  const stepsCount = playthrough.auto_routes.reduce(
    (acc, curr) => acc + curr.steps,
    0,
  );

  return { autoRoutesLength, stepsCount };
};
