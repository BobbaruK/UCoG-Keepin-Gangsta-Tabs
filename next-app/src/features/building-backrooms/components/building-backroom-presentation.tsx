import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BuildingBackroom } from "@/core/cog/building-backroom/types/building-backroom";

interface Props {
  buildingBackroom: BuildingBackroom;
}

const BuildingBackroomPresentation = ({ buildingBackroom }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>{buildingBackroom.name}</span>
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

export default BuildingBackroomPresentation;
