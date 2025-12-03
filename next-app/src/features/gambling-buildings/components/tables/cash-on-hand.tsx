import { CustomButton } from "@/components/custom-button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { gamblingFeatureTitle } from "@/constants/page-title/gambling-feature";
import { GamblingBuilding } from "@/core/cog/gambling-building/types/gambling-building";
import { gamblingFeatureColors } from "@/core/cog/gambling-feature/utils/gambling-feature-colors";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/format-currency";

interface Props {
  gamblingBuilding: GamblingBuilding;
}

const CashOnHand = ({ gamblingBuilding }: Props) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge variant={"info"}>
          {formatCurrency({
            value: gamblingBuilding.features.reduce(
              (acc, curr) => acc + curr.cash_on_hand,
              0,
            ),
          })}
        </Badge>
      </TooltipTrigger>
      <TooltipContent className="flex flex-col gap-2">
        {gamblingBuilding.features
          .filter((feature) => feature.cash_on_hand !== 0)
          .map((feature) => (
            <p key={feature.id} className="flex items-center gap-1">
              <strong>{formatCurrency({ value: feature.cash_on_hand })}</strong>{" "}
              from{" "}
              <CustomButton
                buttonLabel={feature.name}
                linkHref={`${gamblingFeatureTitle.href}/${feature.id}`}
                size={"sm"}
                variant={"link"}
                skeletonClassName="h-9 w-[121px]"
								noSkeleton
                className={cn(
                  "",
                  // gamblingFeatureColors({
                  //   type: feature.type,
                  // }),
                )}
                noEffect
              />
              <span
                className={cn(
                  "block size-3 rounded-full",
                  gamblingFeatureColors({
                    type: feature.type,
                    noHover: true,
                  }),
                )}
              />
            </p>
          ))}
      </TooltipContent>
    </Tooltip>
  );
};

export default CashOnHand;
