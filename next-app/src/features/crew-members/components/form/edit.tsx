"use client";

import { revPath } from "@/actions/revalidate";
import Counter from "@/components/counter";
import { CustomAvatar } from "@/components/custom-avatar";
import { CustomButton } from "@/components/custom-button";
import { StarIcon } from "@/components/icons/star";
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
  FieldContent,
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
import { Switch } from "@/components/ui/switch";
import { DIALOG_MESSAGES, MESSAGES } from "@/constants/messages";
import { captainRolesTitle } from "@/constants/page-title/captain-roles";
import { crewMembersTitle } from "@/constants/page-title/crew-members";
import { nationalitiesTitle } from "@/constants/page-title/nationalities";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { traitsTitle } from "@/constants/page-title/traits";
import { CaptainRole } from "@/core/cog/captain-role/types/captain-role";
import { CrewMember } from "@/core/cog/crew-member/types/crew-member";
import { Nationality } from "@/core/cog/nationality/types/nationality";
import { Trait } from "@/core/cog/trait/types/trait";
import { cn } from "@/lib/utils";
import { formInputId } from "@/lib/utils/form-input-id";
import { dateFormatter, turnToDate } from "@/lib/utils/format-date";
import { setFullName } from "@/lib/utils/full-name";
import { zodResolver } from "@hookform/resolvers/zod";
import { capitalizeFirstLetter } from "better-auth";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { deleteCrewMember } from "../../actions/member/delete";
import { editCrewMember } from "../../actions/member/edit";
import { AddCrewMemberSchema } from "../../schemas/add";

interface Props {
  crewMember: CrewMember;
  playthroughId: string;
  roles: CaptainRole[] | undefined;
  nationalities: Nationality[] | undefined;
  traits: Trait[] | undefined;
  nextTab: () => void;
}

const EditCrewMemberForm = ({
  crewMember,
  playthroughId,
  roles = [],
  nationalities = [],
  traits = [],
  nextTab,
}: Props) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const form = useForm<z.infer<typeof AddCrewMemberSchema>>({
    resolver: zodResolver(AddCrewMemberSchema),
    defaultValues: {
      first_name: crewMember.first_name,
      last_name: crewMember.last_name,
      alias: crewMember.alias || "",
      turn_recruited: crewMember.turn_recruited,
      captain_role: crewMember.cog_captain_roleId || "",
      isDead: crewMember.is_dead,
      nationality: crewMember.nationality.id,
      traits: crewMember.traits.map((trait) => trait.id),
    },
  });
  const turns = useWatch({
    control: form.control,
    name: "turn_recruited", // without supply name will watch the entire form, or ['firstName', 'lastName'] to watch both
  });

  const [comboxCaptainRole, setComboxCaptainRole] = useState(false);
  const [comboxNationality, setComboxNationality] = useState(false);

  const { formId, inputId } = formInputId(
    `edit-${crewMembersTitle.label.singular.toLowerCase()}-form`,
  );

  const onSubmit = (values: z.infer<typeof AddCrewMemberSchema>) => {
    startTransition(async () => {
      editCrewMember({
        memberId: crewMember.id,
        playthroughId: playthroughId,
        values,
      })
        .then(async (data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);

            setTimeout(() => {
              revPath(
                `${playthroughTitle.href}/${playthroughId + crewMembersTitle.href}`,
              );
            }, 250);

            // router.push(
            //   `${playthroughTitle.href}/${playthroughId + crewMembersTitle.href}/${crewMember.id}`,
            // );

            nextTab();
          }
        })
        .catch(() => {
          toast.error(MESSAGES.SOMETHING_WRONG);
        });
    });
  };

  const unassigned = roles.find(
    (role) => role.name.toLowerCase() === "unassigned",
  );

  const handleDelete = () => {
    startTransition(async () => {
      setOpenDeleteDialog(false);

      await deleteCrewMember(crewMember)
        .then(async (data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);

            setTimeout(() => {
              revPath(
                `${playthroughTitle.href}/${crewMember.playthrough.id + crewMembersTitle.href}`,
              );
              router.push(
                `${playthroughTitle.href}/${crewMember.playthrough.id + crewMembersTitle.href}`,
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
            name="first_name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId(field.name)}>
                  First name
                </FieldLabel>
                <Input
                  {...field}
                  id={inputId(field.name)}
                  aria-invalid={fieldState.invalid}
                  placeholder="Ada"
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
            name="last_name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId(field.name)}>Last name</FieldLabel>
                <Input
                  {...field}
                  id={inputId(field.name)}
                  aria-invalid={fieldState.invalid}
                  placeholder="Cristea"
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
            name="alias"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId(field.name)}>Alias</FieldLabel>
                <Input
                  {...field}
                  id={inputId(field.name)}
                  aria-invalid={fieldState.invalid}
                  placeholder="Bottles"
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
            name="turn_recruited"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId(field.name)}>
                  Recruited turn (
                  {dateFormatter({
                    date: turnToDate(turns),
                    options: {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  })}
                  )
                </FieldLabel>
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
                    {...form.register("turn_recruited", {
                      valueAsNumber: true,
                    })}
                  />
                  <Counter
                    value={field.value}
                    emitClick={(val) => form.setValue("turn_recruited", val)}
                    minValue={1}
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
            name="captain_role"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId(field.name)}>
                  {capitalizeFirstLetter(
                    captainRolesTitle.label.singular.toLowerCase(),
                  )}
                </FieldLabel>

                <Popover
                  open={comboxCaptainRole}
                  onOpenChange={setComboxCaptainRole}
                >
                  <PopoverTrigger asChild>
                    <Button
                      {...field}
                      id={inputId(field.name)}
                      aria-invalid={fieldState.invalid}
                      variant="outline"
                      role="combobox"
                      aria-expanded={comboxCaptainRole}
                      className={cn(
                        "dark:bg-input/30 hover:dark:bg-accent justify-between bg-transparent shadow-xs",
                        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                      )}
                      disabled={isPending}
                    >
                      {form.getValues("captain_role") ? (
                        <span className="flex items-center gap-2">
                          <CustomAvatar
                            image={
                              roles.find(
                                (role) =>
                                  role.id === form.getValues("captain_role"),
                              )?.image
                            }
                            icon={<StarIcon className="text-foreground" />}
                            className="size-6 rounded-md border-none"
                            fit="contain"
                          />
                          {
                            roles.find(
                              (role) =>
                                role.id === form.getValues("captain_role"),
                            )?.name
                          }
                        </span>
                      ) : (
                        `Select ${captainRolesTitle.label.singular.toLowerCase()}...`
                      )}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder={`Search ${captainRolesTitle.label.singular.toLowerCase()}...`}
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>
                          No {captainRolesTitle.label.singular.toLowerCase()}{" "}
                          found.
                        </CommandEmpty>
                        <CommandGroup>
                          {unassigned && (
                            <CommandItem
                              key={unassigned.id}
                              value={unassigned.name}
                              onSelect={(currentValue) => {
                                const role = roles.find(
                                  (role) => role.name === currentValue,
                                );

                                form.setValue(
                                  "captain_role",
                                  role &&
                                    role?.id === form.getValues("captain_role")
                                    ? ""
                                    : role?.id,
                                );
                                setComboxCaptainRole(false);
                              }}
                            >
                              <CustomAvatar
                                image={unassigned.image}
                                className="size-6 rounded-md border-none"
                                icon={<StarIcon />}
                                fit="contain"
                              />
                              {unassigned.name}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  form.getValues("captain_role") ===
                                    unassigned.id
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          )}
                          {roles
                            .filter(
                              (role) =>
                                role.name.toLowerCase() !== "unassigned",
                            )
                            .map((role) => (
                              <CommandItem
                                key={role.id}
                                value={role.name}
                                onSelect={(currentValue) => {
                                  const role = roles.find(
                                    (role) => role.name === currentValue,
                                  );

                                  form.setValue(
                                    "captain_role",
                                    role &&
                                      role?.id ===
                                        form.getValues("captain_role")
                                      ? ""
                                      : role?.id,
                                  );
                                  setComboxCaptainRole(false);
                                }}
                              >
                                <CustomAvatar
                                  image={role.image}
                                  className="size-6 rounded-md border-none"
                                  fit="contain"
                                />
                                {role.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    form.getValues("captain_role") === role.id
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
            name="nationality"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId(field.name)}>
                  {capitalizeFirstLetter(
                    nationalitiesTitle.label.singular.toLowerCase(),
                  )}
                </FieldLabel>

                <Popover
                  open={comboxNationality}
                  onOpenChange={setComboxNationality}
                >
                  <PopoverTrigger asChild>
                    <Button
                      {...field}
                      id={inputId(field.name)}
                      aria-invalid={fieldState.invalid}
                      variant="outline"
                      role="combobox"
                      aria-expanded={comboxNationality}
                      className={cn(
                        "dark:bg-input/30 hover:dark:bg-accent justify-between bg-transparent shadow-xs",
                        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                      )}
                      disabled={isPending}
                    >
                      {form.getValues("nationality") ? (
                        <span className="flex items-center gap-2">
                          <CustomAvatar
                            image={
                              nationalities.find(
                                (nationality) =>
                                  nationality.id ===
                                  form.getValues("nationality"),
                              )?.flag
                            }
                            className="size-6 rounded-md border-none"
                            fit="contain"
                          />
                          {
                            nationalities.find(
                              (nationality) =>
                                nationality.id ===
                                form.getValues("nationality"),
                            )?.name
                          }
                        </span>
                      ) : (
                        `Select ${nationalitiesTitle.label.singular.toLowerCase()}...`
                      )}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder={`Search ${nationalitiesTitle.label.singular.toLowerCase()}...`}
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>
                          No {nationalitiesTitle.label.singular.toLowerCase()}{" "}
                          found.
                        </CommandEmpty>
                        <CommandGroup>
                          {nationalities.map((nationality) => (
                            <CommandItem
                              key={nationality.id}
                              value={nationality.name}
                              onSelect={(currentValue) => {
                                const nationality = nationalities.find(
                                  (nationality) =>
                                    nationality.name === currentValue,
                                );

                                if (nationality) {
                                  form.setValue(
                                    "nationality",
                                    nationality.id ===
                                      form.getValues("nationality")
                                      ? ""
                                      : nationality.id || "",
                                  );

                                  setComboxNationality(false);
                                  form.clearErrors("nationality");
                                }
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <CustomAvatar
                                  image={nationality.flag}
                                  className="size-6 rounded-md border-none"
                                  fit="contain"
                                />
                                {nationality.name}
                              </div>
                              <Check
                                className={cn(
                                  "ml-auto",
                                  form.getValues("nationality") ===
                                    nationality.id
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
            name="traits"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId(field.name)}>Traits</FieldLabel>

                <MultiSelect
                  id={inputId(field.name)}
                  aria-invalid={fieldState.invalid}
                  options={
                    traits.map((trait) => ({
                      value: trait.id,
                      label: trait.name,
                      // disabled: true,
                      image: (
                        <CustomAvatar
                          image={trait.image}
                          className="size-6 rounded-md border-none"
                          fit="contain"
                        />
                      ),
                      // icon: React.createElement(CustomAvatar, {}),
                    })) || []
                  }
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  placeholder={`Choose ${traitsTitle.label.plural.toLowerCase()}...`}
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

          <Controller
            name="isDead"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                orientation={"horizontal"}
              >
                <FieldContent>
                  <FieldLabel htmlFor={inputId(field.name)}>Is dead</FieldLabel>
                  {crewMember.is_boss && (
                    <FieldDescription>
                      If your boss died, this playthrough is over
                    </FieldDescription>
                  )}
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>

                <Switch
                  id={inputId(field.name)}
                  aria-invalid={fieldState.invalid}
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isPending}
                />
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
              resource: crewMembersTitle.label.singular.toLowerCase(),
              resourceName: setFullName({
                firstName: crewMember.first_name,
                lastName: crewMember.last_name,
                alias: crewMember.alias,
              }).outputFE,
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
          buttonLabel={`Save ${crewMembersTitle.label.singular.toLowerCase()}`}
          type="submit"
          className=""
          disabled={isPending}
          skeletonClassName="h-9 w-[152px]"
          variant={"success"}
        />
      </div>
    </form>
  );
};

export default EditCrewMemberForm;

export function EditCrewMemberFormSkeleton({
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
      <div className="flex items-center justify-between">
        <Skeleton className="h-[19.25px] w-28" />
        <Skeleton className="h-[18.39px] w-8 rounded-2xl" />
      </div>
      <div className="flex flex-wrap items-center justify-end gap-4">
        <Skeleton className="bg-destructive h-9 w-[89px]" />
        <Skeleton className="bg-muted h-9 w-[68px] border" />
        <Skeleton className="bg-success h-9 w-[152px]" />
      </div>
    </div>
  );
}
