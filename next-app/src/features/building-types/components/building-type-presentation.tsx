import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BuildingType } from "@/core/cog/building-type/types/building-type";

interface Props {
  buildingType: BuildingType;
}

const BuildingTypePresentation = ({ buildingType }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>{buildingType.name}</span>
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

export default BuildingTypePresentation;
