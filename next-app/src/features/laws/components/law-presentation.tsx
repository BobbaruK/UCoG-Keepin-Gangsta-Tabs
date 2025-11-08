import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LawType } from "@/generated/prisma";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Law } from "../types/law";

interface Props {
  law: Law;
}

const LawPresentation = ({ law }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {law.name}{" "}
          {law.type === LawType.TEMPORARY && (
            <Badge variant={"warning"}>
              {capitalizeFirstLetter(LawType.TEMPORARY)}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <pre className="max-w-full whitespace-break-spaces">
          {law.description}
        </pre>

        <Separator />

        <div>
          <p>Enact: {law.enact || "N/A"}</p>
          <p>Revoke: {law.revoke || "N/A"}</p>
        </div>
      </CardContent>

      {law.sideEffect && (
        <CardFooter className="flex flex-col items-start">
          <p className="underline">Side effect</p>
          <p>Type: {capitalizeFirstLetter(law.sideEffect.type)}</p>
          <p>
            Value:{" "}
            <Badge
              variant={
                Math.sign(law.sideEffect.value) === 1 ? "success" : "danger"
              }
            >
              {law.sideEffect.value}
            </Badge>
          </p>
        </CardFooter>
      )}
    </Card>
  );
};

export default LawPresentation;
