import { gamblingFeatureTypes } from "@/core/cog/gambling-feature/types/gambling-feature-types";
import { gamblingFeatureColors } from "@/core/cog/gambling-feature/utils/gambling-feature-colors";
import { gamblingFeatureTypes as gamblingFeatureTypesUtil } from "@/core/cog/gambling-feature/utils/gambling-feature-type";
import { cn } from "@/lib/utils";

const Legend = () => {
  return (
    <span className="flex flex-wrap items-center gap-4 p-2">
      {gamblingFeatureTypes.map((type) => (
        <small key={type} className="flex items-center gap-2">
          <span
            className={cn(
              "size-3 rounded-full",
              gamblingFeatureColors({
                type,
                noHover: true,
              }),
            )}
          />
          {gamblingFeatureTypesUtil(type)}
        </small>
      ))}
    </span>
  );
};

export default Legend;
