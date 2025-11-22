import { CustomAvatar } from "@/components/custom-avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { resourceTypesTitle } from "@/constants/page-title/resource-types";
import { Resource } from "@/core/db/resource/types/resource";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { formatCurrency } from "@/lib/utils/format-currency";
import Link from "next/link";

interface Props {
  resource: Resource;
}

const ResourcePresentation = ({ resource }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CustomAvatar
            className="rounded-md border-none"
            image={resource.image}
            fit="contain"
          />
          <span>{resource.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          Category: {capitalizeFirstLetter(resource.category.toLowerCase())}
        </p>
        <p>
          Price:{" "}
          {formatCurrency({
            value: resource.price,
          })}
        </p>
        <p>
          Type:{" "}
          <Button size={"sm"} variant={"link"} asChild className="h-auto p-0">
            <Link
              href={`${resourceTypesTitle.href}/${resource.resource_type.id}`}
            >
              {resource.resource_type.name}
            </Link>
          </Button>
        </p>
        <p>Capacity: {resource.resource_type.capacity}</p>
      </CardContent>
    </Card>
  );
};

export default ResourcePresentation;
