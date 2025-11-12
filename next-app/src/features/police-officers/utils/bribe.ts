import {
  POLICE_BRIBE_DURATION,
  POLICE_BRIBE_DURATION_POLITICAL,
  POLICE_BRIBE_DURATION_RESPECT_LAW,
} from "@/constants/misc";

export const bribeDuration = ({
  politicalContact = false,
  respectForTheLaw = false,
  bribedTurn = 1,
}: {
  politicalContact?: boolean;
  respectForTheLaw?: boolean;
  bribedTurn?: number;
} = {}) => {
  let turns = 0;

  if (respectForTheLaw) turns += POLICE_BRIBE_DURATION_RESPECT_LAW;

  if (politicalContact) {
    turns += POLICE_BRIBE_DURATION_POLITICAL;
  } else {
    turns += POLICE_BRIBE_DURATION;
  }

  return Math.floor(bribedTurn + turns);
};
