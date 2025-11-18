import { CustomButton } from "@/components/custom-button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BASE_ACTION_POINTS, BASE_MOVEMENT_POINTS } from "@/constants/misc";
import { traitsTitle } from "@/constants/page-title/traits";
import { SideEffectType } from "@/generated/prisma";
import { CrewMember } from "../../types/crew-member";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { lawsTitle } from "@/constants/page-title/laws";
import { captainRolesTitle } from "@/constants/page-title/captain-roles";
import Link from "next/link";

const basePoints = (type: SideEffectType) => {
  switch (type) {
    case "MOVEMENT":
      return BASE_MOVEMENT_POINTS;

    default:
      return BASE_ACTION_POINTS;
  }
};

interface Props {
  crewMember: CrewMember;
  type: SideEffectType;
}

const Points = ({ crewMember, type }: Props) => {
  // Base
  const driverLevel =
    crewMember.experience.find((xp) =>
      xp.level.name.toLowerCase().includes("driver"),
    )?.value || 0;

  const opportunistLevel =
    crewMember.experience.find((xp) =>
      xp.level.name.toLowerCase().includes("opportunist"),
    )?.value || 0;

  // Base
  const driver = type === SideEffectType.MOVEMENT ? driverLevel * 2 : 0;
  const opportunist =
    type === SideEffectType.ACTION
      ? opportunistLevel === 3
        ? 4
        : opportunistLevel
      : 0;

  // Traits
  const traits = crewMember.traits;
  const traitsPointsPositive = traits.find(
    (trait) =>
      trait.sideEffect &&
      trait.sideEffect.type === type &&
      (Math.sign(trait.sideEffect.value) === 1 ||
        Math.sign(trait.sideEffect.value) === 0),
  );
  const traitsPointsNegative = traits.find(
    (trait) =>
      trait.sideEffect &&
      trait.sideEffect.type === type &&
      Math.sign(trait.sideEffect.value) === -1,
  );
  const traitsPoints =
    (traitsPointsPositive?.sideEffect?.value || 0) +
    (traitsPointsNegative?.sideEffect?.value || 0);

  // Laws
  const laws = crewMember.playthrough.laws;
  const lawsPoints = laws.reduce((acc, curr) => {
    const current =
      curr.sideEffect && curr.sideEffect.type === type
        ? curr.sideEffect.value
        : 0;

    return acc + current;
  }, 0);

  // Captain
  const captain = crewMember.captain;
  const captainPoints =
    captain && captain.sideEffect && captain.sideEffect.type === type
      ? captain?.sideEffect?.value
      : 0;

  // Train stations
  const isPassengerStation = crewMember.playthrough.passenger_rail_station;
  const passengerStationPoints =
    isPassengerStation && type === SideEffectType.ACTION ? 1 : 0;

  const isFreightStation = crewMember.playthrough.freight_rail_station;
  const freightStationPoints =
    isFreightStation && type === SideEffectType.MOVEMENT ? 2 : 0;

  const points = [
    basePoints(type),
    driver,
    opportunist,
    traitsPoints,
    lawsPoints,
    captainPoints,
    passengerStationPoints,
    freightStationPoints,
  ].reduce((acc, curr) => acc + curr, 0);

  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge variant={"info"}>{points}</Badge>
      </TooltipTrigger>
      <TooltipContent className="flex flex-col gap-4 pb-4">
        <h3 className="font-medium underline">
          {capitalizeFirstLetter(SideEffectType[type])} points
        </h3>

        <ul className="flex flex-col gap-1">
          <li className="flex items-center gap-1">
            <Badge variant={"success"} className="w-8">
              <span>+{basePoints(type)}</span>
            </Badge>
            from base
          </li>
        </ul>

        {(traitsPointsPositive || traitsPointsNegative) && (
          <ul className="flex flex-col gap-1">
            {traitsPointsPositive && traitsPointsPositive.sideEffect && (
              <li className="flex items-center gap-1">
                <Badge variant={"success"} className="w-8">
                  <span>+{traitsPointsPositive.sideEffect.value}</span>
                </Badge>
                from trait
                <Link
                  href={`${traitsTitle.href}/${traitsPointsPositive.id}`}
                  className="font-bold"
                >
                  {traitsPointsPositive.name}
                </Link>
              </li>
            )}
            {traitsPointsNegative && traitsPointsNegative.sideEffect && (
              <li className="flex items-center gap-1">
                <Badge variant={"danger"} className="w-8">
                  <span>{traitsPointsNegative.sideEffect.value}</span>
                </Badge>
                from trait
                <Link
                  href={`${traitsTitle.href}/${traitsPointsNegative.id}`}
                  className="font-bold"
                >
                  {traitsPointsNegative.name}
                </Link>
              </li>
            )}
          </ul>
        )}

        {laws.length && lawsPoints !== 0 && (
          <ul className="flex flex-col gap-1">
            {laws.map((law) => {
              if (!law.sideEffect) return null;

              if (law.sideEffect.type)
                return (
                  <li key={law.id} className="flex items-center gap-1">
                    <Badge
                      variant={
                        Math.sign(law.sideEffect.value) === 1
                          ? "success"
                          : "danger"
                      }
                      className="w-8"
                    >
                      <span>
                        {law.sideEffect &&
                          Math.sign(law.sideEffect.value) === 1 &&
                          "+"}
                        {law.sideEffect.value}
                      </span>
                    </Badge>
                    from law
                    <Link
                      href={`${lawsTitle.href}/${law.id}`}
                      className="font-bold"
                    >
                      {law.name}
                    </Link>
                  </li>
                );
            })}
          </ul>
        )}

        {captain && captainPoints !== 0 && (
          <ul className="flex flex-col gap-1">
            <li className="flex items-center gap-1">
              <Badge
                variant={Math.sign(captainPoints) === 1 ? "success" : "danger"}
                className="w-8"
              >
                <span>
                  {Math.sign(captainPoints) === 1 && "+"}
                  {captainPoints}
                </span>
              </Badge>
              from role
              <Link
                href={`${captainRolesTitle.href}/${captain.id}`}
                className="font-bold"
              >
                {captain.name}
              </Link>
            </li>
          </ul>
        )}

        {driver > 0 && type === SideEffectType.MOVEMENT && (
          <ul className="flex flex-col gap-1">
            <li className="flex items-center gap-1">
              <Badge variant={"success"} className="w-8">
                <span>+{driver}</span>
              </Badge>
              from crew&apos;s experience:{" "}
              <strong>Efficient Driver: Level {driverLevel}</strong>
            </li>
          </ul>
        )}

        {opportunist > 0 && type === SideEffectType.ACTION && (
          <ul className="flex flex-col gap-1">
            <li className="flex items-center gap-1">
              <Badge variant={"success"} className="w-8">
                <span>+{opportunist}</span>
              </Badge>
              from crew&apos;s experience (Smart Opportunist: Level{" "}
              {opportunistLevel})
            </li>
          </ul>
        )}

        {isFreightStation &&
          freightStationPoints > 0 &&
          type === SideEffectType.MOVEMENT && (
            <ul className="flex flex-col gap-1">
              <li className="flex items-center gap-1">
                <Badge variant={"success"} className="w-8">
                  <span>+{freightStationPoints}</span>
                </Badge>
                from <strong>Freight Rail Station</strong>
              </li>
            </ul>
          )}

        {isPassengerStation &&
          passengerStationPoints > 0 &&
          type === SideEffectType.ACTION && (
            <ul className="flex flex-col gap-1">
              <li className="flex items-center gap-1">
                <Badge variant={"success"} className="w-8">
                  <span>+{passengerStationPoints}</span>
                </Badge>
                from <strong>Passenger Rail Station</strong>
              </li>
            </ul>
          )}
      </TooltipContent>
    </Tooltip>
  );
};

export default Points;
