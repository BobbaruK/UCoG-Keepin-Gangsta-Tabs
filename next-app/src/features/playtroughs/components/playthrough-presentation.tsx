import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { lawsTitle } from "@/constants/page-title/laws";
import Link from "next/link";
import { Playthrough } from "../types/playthrough";

interface Props {
  playthrough: Playthrough;
}

const PlaythroughPresentation = ({ playthrough }: Props) => {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Basic data</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Seed: {playthrough.seed || "N/A"}</p>
          <p>
            Passenger train station:{" "}
            <Badge
              variant={
                playthrough.passenger_rail_station ? "success" : "danger"
              }
            >
              {playthrough.passenger_rail_station ? "Yes" : "No"}
            </Badge>
          </p>
          <p>
            Freight train station:{" "}
            <Badge
              variant={playthrough.freight_rail_station ? "success" : "danger"}
            >
              {playthrough.freight_rail_station ? "Yes" : "No"}
            </Badge>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Laws</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {playthrough.laws.map((law) => (
              <li key={law.id} className="flex items-center gap-2">
                <Button variant={"link"} size={"sm"} asChild className="p-0">
                  <Link href={`${lawsTitle.href}/${law.id}`}>{law.name}</Link>
                </Button>

                {law.sideEffect && (
                  <Badge
                    variant={
                      Math.sign(law.sideEffect.value) === 1
                        ? "success"
                        : "danger"
                    }
                  >
                    {law.sideEffect.name}
                  </Badge>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaythroughPresentation;
