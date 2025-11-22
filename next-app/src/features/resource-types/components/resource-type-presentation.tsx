import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResourceType } from "@/core/db/resource-type/types/resource-type";

interface Props {
  resourceType: ResourceType;
}

const ResourceTypePresentation = ({ resourceType }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{resourceType.name} </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p>Capacity: {resourceType.capacity}</p>
      </CardContent>
    </Card>
  );
};

export default ResourceTypePresentation;
