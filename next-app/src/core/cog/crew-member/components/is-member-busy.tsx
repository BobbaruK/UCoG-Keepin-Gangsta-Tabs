import { AutoRouteIcon } from "@/components/icons/auto-route";
import { BuildingIcon } from "@/components/icons/building";
import { GamblingBuildingIcon } from "@/components/icons/gambling-building";
import { CrewMember } from "../types/crew-member";
import { setFullName } from "@/lib/utils/full-name";

interface Props {
  crewMember: CrewMember;
}

const IsMemberBusy = ({ crewMember }: Props) => {
  return (
    <>
      {
        setFullName({
          firstName: crewMember.first_name,
          lastName: crewMember.last_name,
          alias: crewMember.alias,
        }).outputFE
      }

      {crewMember.cogBuildings && (
        <>
          <BuildingIcon />
          {crewMember.cogBuildings.name}{" "}
          {crewMember.cogBuildings.backroom && (
            <>({crewMember.cogBuildings.backroom?.name})</>
          )}
        </>
      )}

      {crewMember.cogAutoRoute && (
        <>
          <AutoRouteIcon />
          {crewMember.cogAutoRoute.name}
        </>
      )}

      {crewMember.cogGamblingBuilding && (
        <>
          <GamblingBuildingIcon />
          <span>
            {crewMember.cogGamblingBuilding.name}{" "}
            <small>
              ({crewMember.cogGamblingBuilding.gambling_building_size.name})
            </small>
          </span>
        </>
      )}
    </>
  );
};

export default IsMemberBusy;
