"use client";

import { revPath } from "@/actions/revalidate";
import { CustomAvatar } from "@/components/custom-avatar";
import { CustomButton } from "@/components/custom-button";
import { AutoRouteIcon } from "@/components/icons/auto-route";
import { ResourceIcon } from "@/components/icons/resource";
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
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
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
import { buildingTitle } from "@/constants/page-title/building";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { BuildingBackroom } from "@/core/cog/building-backroom/types/building-backroom";
import { BuildingPassiveDuration } from "@/core/cog/building-passive-duration/types/building-passive-duration";
import { BuildingPassive } from "@/core/cog/building-passive/types/building-passive-duration";
import { BuildingSize } from "@/core/cog/building-size/types/building-size";
import { BuildingType } from "@/core/cog/building-type/types/building-type";
import { Building } from "@/core/cog/building/types/building";
import { CrewMember } from "@/core/cog/crew-member/types/crew-member";
import { cn } from "@/lib/utils";
import { formInputId } from "@/lib/utils/form-input-id";
import { ft3m3 } from "@/lib/utils/ft3-m3";
import { zodResolver } from "@hookform/resolvers/zod";
import { BuildingIcon, Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { deleteBuilding } from "../../actions/delete";
import { editBuilding } from "../../actions/edit";
import { AddBuildingSchema } from "../../schemas/add";

interface Props {
  building: Building;
  buildingSizes: BuildingSize[] | undefined;
  buildingTypes: BuildingType[] | undefined;
  buildingBackrooms: BuildingBackroom[] | undefined;
  crewMembers: CrewMember[] | undefined;
  passiveProductions: BuildingPassive[] | undefined;
  passiveDurations: BuildingPassiveDuration[] | undefined;
}

const EditBuildingForm = ({
  building,
  buildingSizes = [],
  buildingTypes = [],
  buildingBackrooms = [],
  crewMembers = [],
  passiveProductions = [],
  passiveDurations = [],
}: Props) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const form = useForm<z.infer<typeof AddBuildingSchema>>({
    resolver: zodResolver(AddBuildingSchema),
    defaultValues: {
      name: building.name,
      size: building.size_id,
      type: building.type_id || "",
      backroom: building.backroom_id || "",
      manager: building.manager_id || "",
      passive_productions: building.passive_productions.map(
        (production) => production.id,
      ),
      passive_production_duration:
        building.passive_production_duration_id || "",
    },
  });
  const [comboxSize, setComboxSize] = useState(false);
  const [comboxType, setComboxType] = useState(false);
  const [comboxBackroom, setComboxBackroom] = useState(false);
  const [comboxManager, setComboxManager] = useState(false);
  const [comboxPassiveDuration, setComboxPassiveDuration] = useState(false);

  const { formId, inputId } = formInputId(
    `edit-${buildingTitle.label.singular.toLowerCase()}-form`,
  );

  const onSubmit = (values: z.infer<typeof AddBuildingSchema>) => {
    startTransition(async () => {
      editBuilding(building, values)
        .then(async (data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);
            router.push(
              `${playthroughTitle.href}/${building.playthrough_id + buildingTitle.href}`,
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

      await deleteBuilding(building)
        .then(async (data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);

            setTimeout(() => {
              revPath(
                `${playthroughTitle.href}/${building.playthrough_id}/${buildingTitle.href}`,
              );
              router.push(
                `${playthroughTitle.href}/${building.playthrough_id}/${buildingTitle.href}`,
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
                  placeholder="Abramstov's Romanian Deli"
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
            name="size"
            control={form.control}
            render={({ field, fieldState }) => {
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={inputId(field.name)}>Size</FieldLabel>

                  <Popover open={comboxSize} onOpenChange={setComboxSize}>
                    <PopoverTrigger asChild>
                      <Button
                        {...field}
                        id={inputId(field.name)}
                        aria-invalid={fieldState.invalid}
                        variant="outline"
                        role="combobox"
                        aria-expanded={comboxSize}
                        className={cn(
                          "dark:bg-input/30 hover:dark:bg-accent justify-between bg-transparent shadow-xs",
                          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                        )}
                        disabled={isPending}
                      >
                        {form.getValues("size") ? (
                          <div>
                            {
                              buildingSizes.find(
                                (size) => size.id === form.getValues("size"),
                              )?.name
                            }{" "}
                            (
                            <small
                              dangerouslySetInnerHTML={{
                                __html: ft3m3(
                                  buildingSizes.find(
                                    (size) =>
                                      size.id === form.getValues("size"),
                                  )?.capacity || 0,
                                ).html,
                              }}
                            />
                            )
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
                            {buildingSizes
                              .filter(
                                (size) =>
                                  size.name.toLowerCase() !== "unassigned",
                              )
                              .map((size) => (
                                <CommandItem
                                  key={size.id}
                                  value={size.name}
                                  onSelect={(currentValue) => {
                                    const buildingSize = buildingSizes.find(
                                      (size) => size.name === currentValue,
                                    );

                                    form.setValue(
                                      "size",
                                      buildingSize &&
                                        buildingSize?.id ===
                                          form.getValues("size")
                                        ? ""
                                        : buildingSize?.id || "",
                                    );
                                    setComboxSize(false);
                                  }}
                                >
                                  <div>
                                    {size.name} (
                                    <small
                                      dangerouslySetInnerHTML={{
                                        __html: ft3m3(size.capacity).html,
                                      }}
                                    />
                                    )
                                  </div>

                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      form.getValues("size") === size.id
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
                                  setComboxSize(false);
                                }}
                                disabled={
                                  !!member.cogBuildings || !!member.cogAutoRoute
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
            name="type"
            control={form.control}
            render={({ field, fieldState }) => {
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={inputId(field.name)}>Type</FieldLabel>

                  <Popover open={comboxType} onOpenChange={setComboxType}>
                    <PopoverTrigger asChild>
                      <Button
                        {...field}
                        id={inputId(field.name)}
                        aria-invalid={fieldState.invalid}
                        variant="outline"
                        role="combobox"
                        aria-expanded={comboxType}
                        className={cn(
                          "dark:bg-input/30 hover:dark:bg-accent justify-between bg-transparent shadow-xs",
                          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                        )}
                        disabled={isPending}
                      >
                        {form.getValues("type")
                          ? buildingTypes.find(
                              (type) => type.id === form.getValues("type"),
                            )?.name
                          : `Select type...`}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Command>
                        <CommandInput
                          placeholder={`Search type...`}
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No type found.</CommandEmpty>
                          <CommandGroup>
                            {buildingTypes.map((size) => (
                              <CommandItem
                                key={size.id}
                                value={size.name}
                                onSelect={(currentValue) => {
                                  const buildingType = buildingTypes.find(
                                    (type) => type.name === currentValue,
                                  );

                                  form.setValue(
                                    "type",
                                    buildingType &&
                                      buildingType?.id ===
                                        form.getValues("type")
                                      ? ""
                                      : buildingType?.id || "",
                                  );
                                  setComboxSize(false);
                                }}
                              >
                                {size.name}

                                <Check
                                  className={cn(
                                    "ml-auto",
                                    form.getValues("type") === size.id
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
            name="backroom"
            control={form.control}
            render={({ field, fieldState }) => {
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={inputId(field.name)}>
                    Backroom
                  </FieldLabel>

                  <Popover
                    open={comboxBackroom}
                    onOpenChange={setComboxBackroom}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        {...field}
                        id={inputId(field.name)}
                        aria-invalid={fieldState.invalid}
                        variant="outline"
                        role="combobox"
                        aria-expanded={comboxBackroom}
                        className={cn(
                          "dark:bg-input/30 hover:dark:bg-accent justify-between bg-transparent shadow-xs",
                          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                        )}
                        disabled={isPending}
                      >
                        {form.getValues("backroom")
                          ? buildingBackrooms.find(
                              (backroom) =>
                                backroom.id === form.getValues("backroom"),
                            )?.name
                          : `Select backroom...`}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Command>
                        <CommandInput
                          placeholder={`Search backroom...`}
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No backroom found.</CommandEmpty>
                          <CommandGroup>
                            {buildingBackrooms.map((backroom) => (
                              <CommandItem
                                key={backroom.id}
                                value={backroom.name}
                                onSelect={(currentValue) => {
                                  const buildingBackroom =
                                    buildingBackrooms.find(
                                      (backroom) =>
                                        backroom.name === currentValue,
                                    );

                                  form.setValue(
                                    "backroom",
                                    buildingBackroom &&
                                      buildingBackroom?.id ===
                                        form.getValues("backroom")
                                      ? ""
                                      : buildingBackroom?.id || "",
                                  );
                                  setComboxSize(false);
                                }}
                              >
                                {backroom.name}

                                <Check
                                  className={cn(
                                    "ml-auto",
                                    form.getValues("backroom") === backroom.id
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
            name="passive_productions"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId(field.name)}>
                  Passive productions
                </FieldLabel>

                <MultiSelect
                  id={inputId(field.name)}
                  aria-invalid={fieldState.invalid}
                  options={
                    passiveProductions.map((passive) => ({
                      value: passive.id,
                      label: `${passive.resource.name} (${passive.quantity})`,
                      image: (
                        <CustomAvatar
                          image={passive.resource.image}
                          className="size-4 rounded-sm border-none"
                          fit="contain"
                          icon={<ResourceIcon />}
                        />
                      ),
                      // disabled: true,
                    })) || []
                  }
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  placeholder={`Choose passive production...`}
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
                    desktop: {
                      compactMode: true,
                      maxCount: 3,
                    },
                  }}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="passive_production_duration"
            control={form.control}
            render={({ field, fieldState }) => {
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={inputId(field.name)}>
                    Passive duration
                  </FieldLabel>

                  <Popover
                    open={comboxPassiveDuration}
                    onOpenChange={setComboxPassiveDuration}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        {...field}
                        id={inputId(field.name)}
                        aria-invalid={fieldState.invalid}
                        variant="outline"
                        role="combobox"
                        aria-expanded={comboxPassiveDuration}
                        className={cn(
                          "dark:bg-input/30 hover:dark:bg-accent justify-between bg-transparent shadow-xs",
                          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                        )}
                        disabled={isPending}
                      >
                        {form.getValues("passive_production_duration")
                          ? passiveDurations.find(
                              (duration) =>
                                duration.id ===
                                form.getValues("passive_production_duration"),
                            )?.name
                          : `Select duration...`}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Command>
                        <CommandInput
                          placeholder={`Search duration...`}
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No duration found.</CommandEmpty>
                          <CommandGroup>
                            {passiveDurations.map((duration) => (
                              <CommandItem
                                key={duration.id}
                                value={duration.name}
                                onSelect={(currentValue) => {
                                  const productionDuration =
                                    passiveDurations.find(
                                      (member) => member.name === currentValue,
                                    );

                                  form.setValue(
                                    "passive_production_duration",
                                    productionDuration &&
                                      productionDuration?.id ===
                                        form.getValues(
                                          "passive_production_duration",
                                        )
                                      ? ""
                                      : productionDuration?.id || "",
                                  );
                                  setComboxSize(false);
                                }}
                              >
                                {duration.turns * 7} days / {duration.turns}{" "}
                                turns
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    form.getValues(
                                      "passive_production_duration",
                                    ) === duration.id
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
              resource: buildingTitle.label.singular.toLowerCase(),
              resourceName: building.name,
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
          buttonLabel={`Save ${buildingTitle.label.singular.toLowerCase()}`}
          type="submit"
          disabled={isPending}
          skeletonClassName="h-9 w-[148px]"
          variant={"success"}
        />
      </div>
    </form>
  );
};

export default EditBuildingForm;

export function EditBuildingFormSkeleton({
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
        <Skeleton className="bg-destructive h-9 w-[89px]" />
        <Skeleton className="bg-muted h-9 w-[68px] border" />
        <Skeleton className="bg-success h-9 w-[118px]" />
      </div>
    </div>
  );
}
