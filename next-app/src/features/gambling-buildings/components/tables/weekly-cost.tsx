import { CustomButton } from "@/components/custom-button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { crewLevelsTitle } from "@/constants/page-title/crew-levels";
import { gamblingFeatureTitle } from "@/constants/page-title/gambling-feature";
import { traitsTitle } from "@/constants/page-title/traits";
import { GamblingBuilding } from "@/core/cog/gambling-building/types/gambling-building";
import { weeklyCostCalculator } from "@/core/cog/gambling-feature/utils/weekly-cost-calculator";
import { formatCurrency } from "@/lib/utils/format-currency";

interface Props {
  gamblingBuilding: GamblingBuilding;
}

const WeeklyCost = ({ gamblingBuilding }: Props) => {
  const {
    totalWeeklyCost,
    percentage,
    organizedTrait,
    latestLightings,
    houseManagerLevel,
  } = weeklyCostCalculator(gamblingBuilding);

  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge variant={"info"}>
          {formatCurrency({
            value: totalWeeklyCost - totalWeeklyCost * percentage,
          })}
        </Badge>
      </TooltipTrigger>
      <TooltipContent className="flex flex-col gap-1">
        <span className="font-medium underline">
          Total:{" "}
          <strong>
            {formatCurrency({
              value: totalWeeklyCost,
            })}
          </strong>
        </span>

        {organizedTrait && (
          <ShowCalculation
            percent={10}
            name={organizedTrait.name}
            what={traitsTitle.label.singular.toLowerCase()}
            href={`${traitsTitle.href}/${organizedTrait.id}`}
          />
        )}

        {latestLightings && (
          <ShowCalculation
            percent={20}
            name={`${latestLightings.name} (DLC)`}
            what={gamblingFeatureTitle.label.singular.toLowerCase()}
            href={`${gamblingFeatureTitle.href}/${latestLightings.id}`}
          />
        )}

        {houseManagerLevel && (
          <>
            {houseManagerLevel.value === 1 && (
              <ShowCalculation
                percent={10}
                name={`${houseManagerLevel.level.name} (${houseManagerLevel.value})`}
                what={crewLevelsTitle.label.singular.toLowerCase()}
                href={`${crewLevelsTitle.href}/${houseManagerLevel.level.id}`}
              />
            )}

            {houseManagerLevel.value === 2 && (
              <ShowCalculation
                percent={20}
                name={`${houseManagerLevel.level.name} (${houseManagerLevel.value})`}
                what={crewLevelsTitle.label.singular.toLowerCase()}
                href={`${crewLevelsTitle.href}/${houseManagerLevel.level.id}`}
              />
            )}

            {houseManagerLevel.value === 3 && (
              <ShowCalculation
                percent={25}
                name={`${houseManagerLevel.level.name} (${houseManagerLevel.value})`}
                what={crewLevelsTitle.label.singular.toLowerCase()}
                href={`${crewLevelsTitle.href}/${houseManagerLevel.level.id}`}
              />
            )}

            {houseManagerLevel.value === 4 && (
              <ShowCalculation
                percent={50}
                name={`${houseManagerLevel.level.name} (${houseManagerLevel.value})`}
                what={crewLevelsTitle.label.singular.toLowerCase()}
                href={`${crewLevelsTitle.href}/${houseManagerLevel.level.id}`}
              />
            )}
          </>
        )}
      </TooltipContent>
    </Tooltip>
  );
};

export default WeeklyCost;

function ShowCalculation({
  percent,
  name,
  what,
  href,
}: {
  percent: number;
  name: string;
  what: string;
  href: string;
}) {
  return (
    <span>
      <strong>-{percent}%</strong> from{" "}
      <span className="font-medium underline">{what}</span>
      <CustomButton
        buttonLabel={name}
        linkHref={href}
        size={"sm"}
        variant={"link"}
        skeletonClassName="h-9 w-[121px]"
        noEffect
      />
    </span>
  );
}
