import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { crewLevelsTitle } from "@/constants/page-title/crew-levels";
import { CrewLevel } from "@/core/db/crew-level/types/crew-level";
import { CrewLevelType } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { formInputId } from "@/lib/utils/form-input-id";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldArrayWithId,
  GetValuesConfig,
} from "react-hook-form";

interface Props {
  levels: CrewLevel[] | undefined;
  controllerField: ControllerRenderProps<
    {
      experiences: {
        memberId: string;
        levelId: string;
        value: number;
      }[];
    },
    `experiences.${number}.levelId`
  >;
  fieldState: ControllerFieldState;
  memberId: string;
  index: number;
  fields: FieldArrayWithId<
    {
      experiences: {
        memberId: string;
        levelId: string;
        value: number;
      }[];
    },
    "experiences",
    "id"
  >[];
  getValues: (
    name: `experiences.${number}.levelId`,
    config?: GetValuesConfig,
  ) => string;
  setValue: (
    name: `experiences.${number}.levelId`,
    value: string,
    options?:
      | Partial<{
          shouldValidate: boolean;
          shouldDirty: boolean;
          shouldTouch: boolean;
        }>
      | undefined,
  ) => void;
  updateExperience: (
    index: number,
    value: {
      memberId: string;
      levelId: string;
      value: number;
    },
  ) => void;
}

const Levels = ({
  levels,
  controllerField,
  fieldState,
  index,
  fields,
  memberId,
  getValues,
  setValue,
  updateExperience,
}: Props) => {
  const [comboxCaptainRole, setComboxCaptainRole] = useState(false);
  const crewLevelTypes = Object.keys(CrewLevelType);

  const { inputId } = formInputId("edit-experience");

  return (
    <Popover open={comboxCaptainRole} onOpenChange={setComboxCaptainRole}>
      <PopoverTrigger asChild>
        <Button
          {...controllerField}
          id={inputId(controllerField.name)}
          aria-invalid={fieldState.invalid}
          variant="outline"
          role="combobox"
          aria-expanded={comboxCaptainRole}
          className={cn(
            "justify-between",
            "dark:bg-input/30 hover:dark:bg-accent justify-between bg-transparent shadow-xs",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          )}
        >
          {getValues(`experiences.${index}.levelId`)
            ? levels?.find(
                (role) => role.id === getValues(`experiences.${index}.levelId`),
              )?.name
            : `Select ${crewLevelsTitle.label.singular.toLowerCase()}...`}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      {/* <pre>{JSON.stringify(levels, null, 2)}</pre> */}

      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput
            placeholder={`Search ${crewLevelsTitle.label.singular.toLowerCase()}...`}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>
              No {crewLevelsTitle.label.singular.toLowerCase()} found.
            </CommandEmpty>

            {crewLevelTypes.map((type) => (
              <CommandGroup
                key={type}
                heading={capitalizeFirstLetter(type.toLowerCase())}
              >
                {levels
                  ?.filter((level) => level.type === type)
                  .map((level) => (
                    <CommandItem
                      value={level.name}
                      key={level.id + level.type}
                      onSelect={(currentValue) => {
                        const level = levels.find(
                          (level) => level.name === currentValue,
                        );

                        setValue(
                          `experiences.${index}.levelId`,
                          level &&
                            level?.id ===
                              getValues(`experiences.${index}.levelId`)
                            ? ""
                            : level?.id || "",
                        );
                        setComboxCaptainRole(false);

                        updateExperience(index, {
                          levelId: level?.id || "",
                          memberId,
                          value: 1,
                        });
                      }}
                      disabled={fields
                        .map((field) => field.levelId)
                        .includes(level?.id || "")}
                    >
                      {level.name}
                      <Check
                        className={cn(
                          "ml-auto",
                          getValues(`experiences.${index}.levelId`) === level.id
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Levels;
