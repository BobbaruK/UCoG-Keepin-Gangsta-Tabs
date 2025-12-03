import { Playthrough } from "@/core/cog/playthrough/types/playthrough";
import { autoRoutesAndCount } from "./auto-routes";
import { buildingsAndCount } from "./buildings";
import { gamblingBuildingsAndCount } from "./gambling";
import { membersAndCount } from "./members";

export const playthroughPeak = ({
  playthrough,
}: {
  playthrough: Playthrough;
}) => {
  const boss = playthrough.crew_members.find(
    (member) => member.is_boss === true,
  );

  const { membersLength, captainsLength, managersLength, muscleLength } =
    membersAndCount(playthrough);

  const { autoRoutesLength, stepsCount } = autoRoutesAndCount(playthrough);

  const copsLength = playthrough.police_officers.length;

  const { buildingsCapacity, buildingsLength, buildingsUsedLength } =
    buildingsAndCount(playthrough);

  const { gamblingCashOnHand, gamblingLength, gamblingWeeklyCosts } =
    gamblingBuildingsAndCount(playthrough);

  return {
    autoRoutesLength,
    boss,
    buildingsCapacity,
    buildingsLength,
    buildingsUsedLength,
    captainsLength,
    copsLength,
    gamblingCashOnHand,
    gamblingLength,
    gamblingWeeklyCosts,
    managersLength,
    membersLength,
    muscleLength,
    stepsCount,
  };
};
