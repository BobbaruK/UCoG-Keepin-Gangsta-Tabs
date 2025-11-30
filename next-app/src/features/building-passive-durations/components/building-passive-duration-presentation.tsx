import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BuildingPassiveDuration } from "@/core/cog/building-passive-duration/types/building-passive-duration";
import { BuildingSize } from "@/core/cog/building-size/types/building-size";

interface Props {
  buildingPassiveDuration: BuildingPassiveDuration;
}

const BuildingPassiveDurationPresentation = ({ buildingPassiveDuration }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>{buildingPassiveDuration.name}</span>
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

export default BuildingPassiveDurationPresentation;
