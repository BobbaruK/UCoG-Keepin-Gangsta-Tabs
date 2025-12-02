import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GamblingFeature } from "@/core/cog/gambling-feature/types/gambling-feature";

interface Props {
  gamblingFeature: GamblingFeature;
}

const GamblingFeaturePresentation = ({ gamblingFeature }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{gamblingFeature.name} </CardTitle>
        <CardDescription>
          Is Atlantic City DLC?{" "}
          <Badge variant={gamblingFeature.is_dlc ? "success" : "outline"}>
            {gamblingFeature.is_dlc ? "Yes" : "No"}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">Nothing to see here</CardContent>
    </Card>
  );
};

export default GamblingFeaturePresentation;
