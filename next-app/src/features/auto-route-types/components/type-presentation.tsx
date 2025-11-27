import { CustomAvatar } from "@/components/custom-avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AutoRouteType } from "@/core/cog/auto-route-type/types/auto-route-type";
import { CaptainRole } from "@/core/cog/captain-role/types/captain-role";

interface Props {
  autoRouteType: AutoRouteType;
}

const AutoRouteTypePresentation = ({ autoRouteType }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>{autoRouteType.name}</span>
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

export default AutoRouteTypePresentation;
