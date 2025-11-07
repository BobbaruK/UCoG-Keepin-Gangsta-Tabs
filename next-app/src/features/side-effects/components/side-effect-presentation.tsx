import { CustomAvatar } from "@/components/custom-avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { SideEffect } from "../types/side-effect";

interface Props {
  sideEffect: SideEffect;
}

const SideEffectPresentation = ({ sideEffect }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{sideEffect.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="max-w-full whitespace-break-spaces">
          {sideEffect.description}
        </pre>
      </CardContent>

      <CardFooter className="flex flex-col items-start">
        <p>Value: {sideEffect.value}</p>
        <p>Type: {capitalizeFirstLetter(sideEffect.type)}</p>
      </CardFooter>
    </Card>
  );
};

export default SideEffectPresentation;
