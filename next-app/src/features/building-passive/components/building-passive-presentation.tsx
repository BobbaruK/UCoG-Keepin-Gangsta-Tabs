import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BuildingPassive } from "@/core/cog/building-passive/types/building-passive-duration";

interface Props {
  buildingPassive: BuildingPassive;
}

const BuildingPassivePresentation = ({ buildingPassive }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>
            {buildingPassive.resource?.name} (${buildingPassive.quantity})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="max-w-full whitespace-break-spaces">
          Nothing to see here
        </pre>
      </CardContent>
    </Card>
  );
};

export default BuildingPassivePresentation;
