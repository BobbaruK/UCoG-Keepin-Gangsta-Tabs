import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VehicleType } from "@/core/cog/vehicle-type/types/vehicle-type";

interface Props {
  vehicleType: VehicleType;
}

const VehicleTypePresentation = ({ vehicleType }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{vehicleType.name} </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p>Capacity: {vehicleType.capacity}</p>
      </CardContent>
    </Card>
  );
};

export default VehicleTypePresentation;
