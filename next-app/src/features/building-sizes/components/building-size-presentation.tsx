import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BuildingSize } from "@/core/cog/building-size/types/building-size";

interface Props {
  buildingSize: BuildingSize;
}

const BuildingSizePresentation = ({ buildingSize }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>{buildingSize.name}</span>
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

export default BuildingSizePresentation;
