"use client";

import Counter from "@/components/counter";
import { CustomButton } from "@/components/custom-button";
import { AutoRouteIcon } from "@/components/icons/auto-route";
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
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { MESSAGES } from "@/constants/messages";
import { autoRouteTypesTitle } from "@/constants/page-title/auto-route-types";
import { autoRoutesTitle } from "@/constants/page-title/auto-routes";
import { crewMembersTitle } from "@/constants/page-title/crew-members";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { vehicleTypesTitle } from "@/constants/page-title/vehicle-types";
import { AutoRouteType } from "@/core/cog/auto-route-type/types/auto-route-type";
import { CrewMember } from "@/core/cog/crew-member/types/crew-member";
import { Playthrough } from "@/core/cog/playthrough/types/playthrough";
import { VehicleType } from "@/core/cog/vehicle-type/types/vehicle-type";
import { cn } from "@/lib/utils";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { formInputId } from "@/lib/utils/form-input-id";
import { setFullName } from "@/lib/utils/full-name";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { addAutoRoute } from "../../actions/add";
import { AddAutoRouteSchema } from "../../schemas/add";

interface Props {
  playthrough: Playthrough;
  crewMembers?: CrewMember[];
  vehicleTypes?: VehicleType[];
  autoRouteTypes?: AutoRouteType[];
}

const AddAutoRouteForm = ({
  playthrough,
  crewMembers = [],
  vehicleTypes = [],
  autoRouteTypes = [],
}: Props) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof AddAutoRouteSchema>>({
    resolver: zodResolver(AddAutoRouteSchema),
    defaultValues: {
      name: "",
      steps: 0,
      crew_member: "",
      route_type: [],
      vehicle_type: "",
    },
  });
  const [comboxAutoRoute, setComboxAutoRoute] = useState(false);
  const [comboxVehicleType, setComboxVehicleType] = useState(false);

  const { formId, inputId } = formInputId(
    `add-${autoRoutesTitle.label.singular.toLowerCase()}-form`,
  );

  const onSubmit = (values: z.infer<typeof AddAutoRouteSchema>) => {
    startTransition(async () => {
      addAutoRoute({
        playthrough,
        values,
      })
        .then(async (data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);
            router.push(
              `${playthroughTitle.href}/${playthrough.id + autoRoutesTitle.href}`,
            );
          }
        })
        .catch(() => {
          toast.error(MESSAGES.SOMETHING_WRONG);
        });
    });
  };

  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-7"
    >
      <FieldSet>
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId(field.name)}>Name</FieldLabel>
                <Input
                  {...field}
                  id={inputId(field.name)}
                  aria-invalid={fieldState.invalid}
                  placeholder="Buy Stoneware Crocks"
                  autoComplete="off"
                  type="text"
                  disabled={isPending}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="steps"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId(field.name)}>Steps</FieldLabel>
                <div className="flex items-center gap-2">
                  <Input
                    {...field}
                    id={inputId(field.name)}
                    aria-invalid={fieldState.invalid}
                    placeholder="12"
                    autoComplete="off"
                    type="number"
                    disabled={true}
                    className="opacity-100!"
                    {...form.register("steps", { valueAsNumber: true })}
                  />
                  <Counter
                    value={field.value}
                    emitClick={(val) => form.setValue("steps", val)}
                    minValue={0}
                    isPending={isPending}
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="crew_member"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId(field.name)}>
                  {capitalizeFirstLetter(
                    crewMembersTitle.label.singular.toLowerCase(),
                  )}
                </FieldLabel>

                <Popover
                  open={comboxAutoRoute}
                  onOpenChange={setComboxAutoRoute}
                >
                  <PopoverTrigger asChild>
                    <Button
                      {...field}
                      id={inputId(field.name)}
                      aria-invalid={fieldState.invalid}
                      variant="outline"
                      role="combobox"
                      aria-expanded={comboxAutoRoute}
                      className={cn(
                        "dark:bg-input/30 hover:dark:bg-accent justify-between bg-transparent shadow-xs",
                        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                      )}
                      disabled={isPending}
                    >
                      {form.getValues("crew_member")
                        ? crewMembers.find(
                            (member) =>
                              member.id === form.getValues("crew_member"),
                          )?.full_name
                        : `Select ${crewMembersTitle.label.singular.toLowerCase()}...`}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder={`Search ${crewMembersTitle.label.singular.toLowerCase()}...`}
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>
                          No {crewMembersTitle.label.singular.toLowerCase()}{" "}
                          found.
                        </CommandEmpty>
                        <CommandGroup>
                          {crewMembers.map((member) => (
                            <CommandItem
                              key={member.id}
                              value={member.full_name}
                              onSelect={(currentValue) => {
                                const crewMember = crewMembers.find(
                                  (member) => member.full_name === currentValue,
                                );

                                form.setValue(
                                  "crew_member",
                                  crewMember &&
                                    crewMember.id ===
                                      form.getValues("crew_member")
                                    ? ""
                                    : crewMember?.id,
                                );
                                setComboxAutoRoute(false);
                              }}
                              disabled={!!member.cogAutoRoute}
                            >
                              {
                                setFullName({
                                  firstName: member.first_name,
                                  lastName: member.last_name,
                                  alias: member.alias,
                                }).outputFE
                              }{" "}
                              {member.cogAutoRoute && (
                                <>
                                  <AutoRouteIcon />
                                  {member.cogAutoRoute.name}
                                </>
                              )}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  form.getValues("crew_member") === member.id
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="vehicle_type"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId(field.name)}>
                  {capitalizeFirstLetter(
                    vehicleTypesTitle.label.singular.toLowerCase(),
                  )}
                </FieldLabel>

                <Popover
                  open={comboxVehicleType}
                  onOpenChange={setComboxVehicleType}
                >
                  <PopoverTrigger asChild>
                    <Button
                      {...field}
                      id={inputId(field.name)}
                      aria-invalid={fieldState.invalid}
                      variant="outline"
                      role="combobox"
                      aria-expanded={comboxVehicleType}
                      className={cn(
                        "dark:bg-input/30 hover:dark:bg-accent justify-between bg-transparent shadow-xs",
                        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                      )}
                      disabled={isPending}
                    >
                      {form.getValues("vehicle_type")
                        ? vehicleTypes.find(
                            (types) =>
                              types.id === form.getValues("vehicle_type"),
                          )?.name
                        : `Select ${vehicleTypesTitle.label.singular.toLowerCase()}...`}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder={`Search ${vehicleTypesTitle.label.singular.toLowerCase()}...`}
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>
                          No {vehicleTypesTitle.label.singular.toLowerCase()}{" "}
                          found.
                        </CommandEmpty>
                        <CommandGroup>
                          {vehicleTypes.map((type) => (
                            <CommandItem
                              key={type.id}
                              value={type.name}
                              onSelect={(currentValue) => {
                                const vehicleType = vehicleTypes.find(
                                  (vType) => vType.name === currentValue,
                                );

                                form.setValue(
                                  "vehicle_type",
                                  vehicleType &&
                                    vehicleType?.id ===
                                      form.getValues("vehicle_type")
                                    ? ""
                                    : vehicleType?.id,
                                );
                                setComboxVehicleType(false);
                              }}
                            >
                              {type.name}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  form.getValues("vehicle_type") === type.id
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="route_type"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId(field.name)}>
                  {autoRouteTypesTitle.label.plural}
                </FieldLabel>

                <MultiSelect
                  id={inputId(field.name)}
                  aria-invalid={fieldState.invalid}
                  options={
                    autoRouteTypes.map((type) => ({
                      value: type.id,
                      label: type.name,
                      // disabled: true,
                    })) || []
                  }
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  placeholder={`Choose ${autoRouteTypesTitle.label.plural.toLowerCase()}...`}
                  hideSelectAll
                  variant={"default"}
                  disabled={isPending}
                  className={cn(
                    "h-9 min-h-9",
                    // "dark:bg-input/30 hover:dark:bg-accent hover:dark:text-accent-foreground justify-between bg-transparent shadow-xs",
                    // "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                    // "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                  )}
                  animationConfig={{
                    badgeAnimation: "slide",
                    optionHoverAnimation: "none",
                    popoverAnimation: "none",
                  }}
                  responsive={{
                    mobile: {
                      maxCount: 0,
                    },
                    tablet: {
                      compactMode: true,
                      maxCount: 1,
                    },
                  }}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </FieldSet>

      <div className="flex flex-wrap items-center justify-end gap-4">
        <CustomButton
          buttonLabel={`Reset`}
          type="reset"
          variant={"outline"}
          disabled={isPending}
          skeletonClassName="h-9 w-[68px]"
          onClick={() => form.reset()}
        />

        <CustomButton
          buttonLabel={`Add ${autoRoutesTitle.label.singular.toLowerCase()}`}
          type="submit"
          className=""
          disabled={isPending}
          skeletonClassName="h-9 w-[145px]"
          variant={"success"}
        />
      </div>
    </form>
  );
};

export default AddAutoRouteForm;

export function AddAutoRouteFormSkeleton({
  className,
  ...restProps
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-7", className)} {...restProps}>
      <div className="flex flex-col justify-end gap-3">
        <Skeleton className="h-[19.25px] w-28" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="flex flex-col justify-end gap-3">
        <Skeleton className="h-[19.25px] w-28" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="size-9 min-w-9" />
          <Skeleton className="size-9 min-w-9" />
          <Skeleton className="size-9 min-w-9" />
        </div>
      </div>
      <div className="flex flex-col justify-end gap-3">
        <Skeleton className="h-[19.25px] w-28" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="flex flex-col justify-end gap-3">
        <Skeleton className="h-[19.25px] w-28" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="flex flex-col justify-end gap-3">
        <Skeleton className="h-[19.25px] w-28" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="flex flex-wrap items-center justify-end gap-4">
        <Skeleton className="bg-muted h-9 w-[68px] border" />
        <Skeleton className="bg-success h-9 w-[129px]" />
      </div>
    </div>
  );
}
