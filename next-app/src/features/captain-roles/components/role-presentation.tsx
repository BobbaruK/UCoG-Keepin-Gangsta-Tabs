import { CustomAvatar } from "@/components/custom-avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CaptainRole } from "../types/roles";

interface Props {
  captainRole: CaptainRole;
}

const RolePresentation = ({ captainRole }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CustomAvatar
            className="rounded-md border-none"
            image={captainRole.image}
            fit="contain"
          />
          <span>{captainRole.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="max-w-full whitespace-break-spaces">
          {captainRole.description}
        </pre>
      </CardContent>
    </Card>
  );
};

export default RolePresentation;
