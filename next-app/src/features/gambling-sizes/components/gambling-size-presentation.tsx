import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GamblingSize } from "@/core/cog/gambling-size/types/gambling-size";

interface Props {
  gamblingSize: GamblingSize;
}

const GamblingSizePresentation = ({ gamblingSize }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{gamblingSize.name} </CardTitle>
        <CardDescription>
          Is Atlantic City DLC?{" "}
          <Badge variant={gamblingSize.is_dlc ? "success" : "warning"}>
            {gamblingSize.is_dlc ? "Yes" : "No"}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">Nothing to see here</CardContent>
    </Card>
  );
};

export default GamblingSizePresentation;
