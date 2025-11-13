import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { CrewLevel } from "../types/level";

interface Props {
  level: CrewLevel;
}

const LevelPresentation = ({ level }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">{level.name}</CardTitle>
        <CardDescription>
          <pre className="max-w-full whitespace-break-spaces">
            {level.description}
          </pre>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Type: {capitalizeFirstLetter(level.type.toLowerCase())}</p>
        <p>
          Max level: <Badge>{level.max_level}</Badge>
        </p>
      </CardContent>
    </Card>
  );
};

export default LevelPresentation;
