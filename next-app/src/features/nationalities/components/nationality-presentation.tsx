import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Nationality } from "@/core/db/nationality/types/nationality";

interface Props {
  nationality: Nationality;
}

const NationalityPresentation = ({ nationality }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{nationality.name} </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <pre className="max-w-full whitespace-break-spaces">
          {nationality.description}
        </pre>
      </CardContent>
    </Card>
  );
};

export default NationalityPresentation;
