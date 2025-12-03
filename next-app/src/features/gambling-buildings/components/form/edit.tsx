"use client";

import { revPath } from "@/actions/revalidate";
import { CustomButton } from "@/components/custom-button";
import { AutoRouteIcon } from "@/components/icons/auto-route";
import { GamblingBuildingIcon } from "@/components/icons/gambling-building";
import { TrashIcon } from "@/components/icons/trash";
import ResponsiveDialog from "@/components/responsive-dialog";
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
  FieldDescription,
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
import { DIALOG_MESSAGES, MESSAGES } from "@/constants/messages";
import { gamblingBuildingsTitle } from "@/constants/page-title/gambling-buildings";
import { gamblingFeatureTitle } from "@/constants/page-title/gambling-feature";
import { gamblingSizeTitle } from "@/constants/page-title/gambling-size";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { CrewMember } from "@/core/cog/crew-member/types/crew-member";
import { GamblingBuilding } from "@/core/cog/gambling-building/types/gambling-building";
import Legend from "@/core/cog/gambling-feature/components/legend";
import { GamblingFeature } from "@/core/cog/gambling-feature/types/gambling-feature";
import { gamblingFeatureColors } from "@/core/cog/gambling-feature/utils/gambling-feature-colors";
import { GamblingSize } from "@/core/cog/gambling-size/types/gambling-size";
import { cn } from "@/lib/utils";
import { formInputId } from "@/lib/utils/form-input-id";
import { zodResolver } from "@hookform/resolvers/zod";
import { BuildingIcon, Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { deleteGamblingBuilding } from "../../actions/delete";
import { editGamblingBuilding } from "../../actions/edit";
import { AddGamblingBuildingSchema } from "../../schemas/add-gambling-building";

interface Props {
  gamblingBuilding: GamblingBuilding;
  crewMembers: CrewMember[] | undefined;
  gamblingSizes: GamblingSize[] | undefined;
  gamblingFeatures: GamblingFeature[] | undefined;
}

const EditGamblingBuildingForm = ({
  gamblingBuilding,
  crewMembers = [],
  gamblingFeatures = [],
  gamblingSizes = [],
}: Props) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const form = useForm<z.infer<typeof AddGamblingBuildingSchema>>({
    resolver: zodResolver(AddGamblingBuildingSchema),
    defaultValues: {
      name: gamblingBuilding.name,
      features: gamblingBuilding.features.map((feature) => feature.id),
      gambling_building_size: gamblingBuilding.gambling_building_size_id,
      manager: gamblingBuilding.manager_id,
    },
  });
  const [comboxGamblingSize, setComboxGamblingSize] = useState(false);
  const [comboxManager, setComboxManager] = useState(false);

  const { formId, inputId } = formInputId(
    `edit-${gamblingBuildingsTitle.label.singular.toLowerCase()}-form`,
  );

  const onSubmit = (values: z.infer<typeof AddGamblingBuildingSchema>) => {
    startTransition(async () => {
      editGamblingBuilding(gamblingBuilding, values)
        .then(async (data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);
            router.push(
              `${playthroughTitle.href}/${gamblingBuilding.playthrough_id + gamblingBuildingsTitle.href}`,
            );
          }
        })
        .catch(() => {
          toast.error(MESSAGES.SOMETHING_WRONG);
        });
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      setOpenDeleteDialog(false);

      await deleteGamblingBuilding(gamblingBuilding)
        .then(async (data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);

            setTimeout(() => {
              revPath(
                `${playthroughTitle.href}/${gamblingBuilding.playthrough_id}/${gamblingBuildingsTitle.href}`,
              );
              router.push(
                `${playthroughTitle.href}/${gamblingBuilding.playthrough_id}/${gamblingBuildingsTitle.href}`,
              );
            }, 250);
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
                  placeholder="Wabash & Mueller"
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
            name="gambling_building_size"
            control={form.control}
            render={({ field, fieldState }) => {
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={inputId(field.name)}>
                    {gamblingSizeTitle.label.singular}
                  </FieldLabel>

                  <Popover
                    open={comboxGamblingSize}
                    onOpenChange={setComboxGamblingSize}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        {...field}
                        id={inputId(field.name)}
                        aria-invalid={fieldState.invalid}
                        variant="outline"
                        role="combobox"
                        aria-expanded={comboxGamblingSize}
                        className={cn(
                          "dark:bg-input/30 hover:dark:bg-accent justify-between bg-transparent shadow-xs",
                          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                        )}
                        disabled={isPending}
                      >
                        {form.getValues("gambling_building_size") ? (
                          <div>
                            {
                              gamblingSizes.find(
                                (size) =>
                                  size.id ===
                                  form.getValues("gambling_building_size"),
                              )?.name
                            }{" "}
                          </div>
                        ) : (
                          `Select size...`
                        )}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Command>
                        <CommandInput
                          placeholder={`Search size...`}
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No size found.</CommandEmpty>
                          <CommandGroup>
                            {gamblingSizes
                              .filter(
                                (size) =>
                                  size.name.toLowerCase() !== "unassigned",
                              )
                              .map((size) => (
                                <CommandItem
                                  key={size.id}
                                  value={size.id}
                                  onSelect={(currentValue) => {
                                    const gamblingSize = gamblingSizes.find(
                                      (size) => size.id === currentValue,
                                    );

                                    form.setValue(
                                      "gambling_building_size",
                                      gamblingSize &&
                                        gamblingSize?.id ===
                                          form.getValues(
                                            "gambling_building_size",
                                          )
                                        ? ""
                                        : gamblingSize?.id || "",
                                    );
                                    setComboxGamblingSize(false);
                                  }}
                                >
                                  <div>
                                    {size.name}{" "}
                                    <small>
                                      {size.is_dlc && `(Atlantic City DLC)`}
                                    </small>
                                  </div>

                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      form.getValues(
                                        "gambling_building_size",
                                      ) === size.id
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
              );
            }}
          />

          <Controller
            name="manager"
            control={form.control}
            render={({ field, fieldState }) => {
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={inputId(field.name)}>Manager</FieldLabel>

                  <Popover open={comboxManager} onOpenChange={setComboxManager}>
                    <PopoverTrigger asChild>
                      <Button
                        {...field}
                        id={inputId(field.name)}
                        aria-invalid={fieldState.invalid}
                        variant="outline"
                        role="combobox"
                        aria-expanded={comboxManager}
                        className={cn(
                          "dark:bg-input/30 hover:dark:bg-accent justify-between bg-transparent shadow-xs",
                          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                        )}
                        disabled={isPending}
                      >
                        {form.getValues("manager")
                          ? crewMembers.find(
                              (member) =>
                                member.id === form.getValues("manager"),
                            )?.full_name
                          : `Select manager...`}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Command>
                        <CommandInput
                          placeholder={`Search manager...`}
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No manager found.</CommandEmpty>
                          <CommandGroup>
                            {crewMembers.map((member) => (
                              <CommandItem
                                key={member.id}
                                value={member.full_name}
                                onSelect={(currentValue) => {
                                  const crewMember = crewMembers.find(
                                    (member) =>
                                      member.full_name === currentValue,
                                  );

                                  form.setValue(
                                    "manager",
                                    crewMember &&
                                      crewMember?.id ===
                                        form.getValues("manager")
                                      ? ""
                                      : crewMember?.id || "",
                                  );
                                  setComboxManager(false);
                                }}
                                disabled={
                                  !!member.cogBuildings ||
                                  !!member.cogAutoRoute ||
                                  !!(
                                    !!member.cogGamblingBuilding &&
                                    member.id !== gamblingBuilding.manager_id
                                  )
                                }
                              >
                                {member.full_name}

                                {member.cogBuildings && (
                                  <>
                                    <BuildingIcon />
                                    {member.cogBuildings.name}{" "}
                                    {member.cogBuildings.backroom && (
                                      <>
                                        ({member.cogBuildings.backroom?.name})
                                      </>
                                    )}
                                  </>
                                )}

                                {member.cogAutoRoute && (
                                  <>
                                    <AutoRouteIcon />
                                    {member.cogAutoRoute.name}
                                  </>
                                )}

                                {member.cogGamblingBuilding && (
                                  <>
                                    <GamblingBuildingIcon />
                                    <span>
                                      {member.cogGamblingBuilding.name}{" "}
                                      <small>
                                        (
                                        {
                                          member.cogGamblingBuilding
                                            .gambling_building_size.name
                                        }
                                        )
                                      </small>
                                    </span>
                                  </>
                                )}

                                <Check
                                  className={cn(
                                    "ml-auto",
                                    form.getValues("manager") === member.id
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
              );
            }}
          />

          <Controller
            name="features"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId(field.name)}>Features</FieldLabel>

                <MultiSelect
                  id={inputId(field.name)}
                  aria-invalid={fieldState.invalid}
                  options={
                    gamblingFeatures.map((feature) => ({
                      value: feature.id,
                      label: `${feature.name + (feature.is_dlc ? ` (DLC)` : "")}`,
                      // disabled: true,
                      image: (
                        <div
                          className={cn(
                            "size-2 rounded-full",
                            gamblingFeatureColors({
                              type: feature.type,
                              noHover: true,
                            }),
                          )}
                        ></div>
                      ),

                      // icon: React.createElement(CustomAvatar, {}),
                    })) || []
                  }
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  placeholder={`Choose ${gamblingFeatureTitle.label.plural.toLowerCase()}...`}
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

                <FieldDescription>
                  <Legend />
                </FieldDescription>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </FieldSet>

      <div className="flex items-center justify-end gap-4">
        <ResponsiveDialog
          open={openDeleteDialog}
          setOpen={setOpenDeleteDialog}
          trigger={{
            type: "element",
            element: (
              <CustomButton
                buttonLabel="Delete"
                variant={"destructive"}
                icon={TrashIcon}
                iconPlacement="left"
                className=""
                disabled={isPending}
                onClick={() => setOpenDeleteDialog(true)}
                skeletonClassName="bg-destructive h-9 w-[89px]"
              />
            ),
            hidden: false,
          }}
          header={
            DIALOG_MESSAGES({
              resource: gamblingBuildingsTitle.label.singular.toLowerCase(),
              resourceName: gamblingBuilding.name,
            }).DELETE
          }
        >
          <div className="flex items-center justify-end">
            <CustomButton
              buttonLabel="Delete"
              variant={"destructive"}
              icon={TrashIcon}
              iconPlacement="left"
              hideLabelOnMobile={false}
              className="ms-auto max-sm:w-full"
              onClick={handleDelete}
            />
          </div>
        </ResponsiveDialog>

        <CustomButton
          buttonLabel={`Reset`}
          type="reset"
          variant={"outline"}
          disabled={isPending}
          skeletonClassName="h-9 w-[68px]"
          onClick={() => form.reset()}
        />

        <CustomButton
          buttonLabel={`Save ${gamblingBuildingsTitle.label.singular.toLowerCase()}`}
          type="submit"
          disabled={isPending}
          skeletonClassName="h-9 w-[148px]"
          variant={"success"}
        />
      </div>
    </form>
  );
};

export default EditGamblingBuildingForm;

export function EditGamblingBuildingFormSkeleton({
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
        <Skeleton className="h-9 w-full" />
      </div>

      <div className="flex flex-col justify-end gap-3">
        <Skeleton className="h-[19.25px] w-28" />
        <Skeleton className="h-9 w-full" />
      </div>

      <div className="flex flex-col justify-end gap-3">
        <Skeleton className="h-[19.25px] w-28" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="my-2 h-[16.8px] w-1/3" />
      </div>

      <div className="flex flex-wrap items-center justify-end gap-4">
        <Skeleton className="bg-destructive h-9 w-[89px]" />
        <Skeleton className="bg-muted h-9 w-[68px] border" />
        <Skeleton className="bg-success h-9 w-[182px]" />
      </div>
    </div>
  );
}
