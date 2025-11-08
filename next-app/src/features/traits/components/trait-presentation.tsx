import { CustomAvatar } from "@/components/custom-avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { Trait } from "../types/trait";

interface Props {
  trait: Trait;
}

const TraitPresentation = ({ trait }: Props) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row items-center gap-2 max-sm:flex-wrap">
          <CustomAvatar
            image={trait.image}
            className="size-16 rounded-sm border-none"
            fit="contain"
          />
          <div>
            <CardTitle>{trait.name}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <pre className="max-w-full whitespace-break-spaces">
          {trait.description}
        </pre>
      </CardContent>

      {trait.sideEffect && (
        <CardFooter className="flex flex-col items-start">
          <p className="underline">Side effect</p>
          <p>Type: {capitalizeFirstLetter(trait.sideEffect.type)}</p>
          <p>
            Value:{" "}
            <Badge
              variant={
                Math.sign(trait.sideEffect.value) === 1 ? "success" : "danger"
              }
            >
              {trait.sideEffect.value}
            </Badge>
          </p>
        </CardFooter>
      )}
    </Card>
  );
};

export default TraitPresentation;
