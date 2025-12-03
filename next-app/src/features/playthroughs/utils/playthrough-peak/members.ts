import { Playthrough } from "@/core/cog/playthrough/types/playthrough";

export const membersAndCount = (playthrough: Playthrough) => {
  const membersLength = playthrough.crew_members.length;

  // Captains
  const captains = playthrough.crew_members.filter(
    (member) => member.cog_captain_roleId !== null,
  );
  const captainsLength = captains.length;

  // Managers
  const managers = playthrough.crew_members.filter(
    (member) => member.cogBuildings !== null,
  );
  const managersLength = managers.length;

  // Muscle
  const muscleLength =
    membersLength - 1 /* Boss */ - captainsLength - managersLength;

  return {
    membersLength,
    captainsLength,
    managersLength,
    muscleLength,
  };
};
