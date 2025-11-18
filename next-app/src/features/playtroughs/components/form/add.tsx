"use client";

import { CustomAvatar } from "@/components/custom-avatar";
import { CustomButton } from "@/components/custom-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  FieldLegend,
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
import { Switch } from "@/components/ui/switch";
import { MESSAGES } from "@/constants/messages";
import { lawsTitle } from "@/constants/page-title/laws";
import { nationalitiesTitle } from "@/constants/page-title/nationalities";
import { playthroughTitle } from "@/constants/page-title/playtrough";
import { traitsTitle } from "@/constants/page-title/traits";
import { Nationality } from "@/core/db/nationality/types/nationality";
import { Trait } from "@/core/db/trait/types/trait";
import { cog_law } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { formInputId } from "@/lib/utils/form-input-id";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { addPlaythrough } from "../../actions/add";
import { AddPlaythroughSchema } from "../../schemas/add-playthrough";

interface Props {
  laws: cog_law[] | undefined;
  nationalities: Nationality[] | undefined;
  traits: Trait[] | undefined;
}

const AddPlaythroughForm = ({
  laws = [],
  nationalities = [],
  traits = [],
}: Props) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [comboxNationality, setComboxNationality] = useState(false);
  const form = useForm<z.infer<typeof AddPlaythroughSchema>>({
    resolver: zodResolver(AddPlaythroughSchema),
    defaultValues: {
      name: "",
      seed: "",
      isPublic: false,
      freightRailStation: false,
      passengerRailStation: false,
      respectForTheLaw: false,
      laws: [],

      boss_first_name: "",
      boss_last_name: "",
      boss_nationality: "",
      boss_traits: [],
    },
  });

  const { formId, inputId } = formInputId(
    `add-${playthroughTitle.label.singular.toLowerCase()}-form`,
  );

  const onSubmit = (values: z.infer<typeof AddPlaythroughSchema>) => {
    startTransition(async () => {
      addPlaythrough(values)
        .then(async (data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);
            router.push(playthroughTitle.href);
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
      className="@container"
    >
      <div className="grid grid-cols-1 gap-6 @2xl:grid-cols-2">
        <Card>
          <CardContent>
            <FieldSet>
              <FieldLegend>Playthrough information</FieldLegend>
              <FieldDescription>
                Set the name, seed and other options.
              </FieldDescription>

              <FieldSeparator />

              <FieldGroup>
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={inputId(field.name)}>
                        Name
                      </FieldLabel>
                      <Input
                        {...field}
                        id={inputId(field.name)}
                        aria-invalid={fieldState.invalid}
                        placeholder="Chicago - Adam Williams"
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
                  name="seed"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={inputId(field.name)}>
                        Seed
                      </FieldLabel>
                      <Input
                        {...field}
                        id={inputId(field.name)}
                        aria-invalid={fieldState.invalid}
                        placeholder="1234567890"
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
                  name="passengerRailStation"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      orientation={"horizontal"}
                    >
                      <FieldContent>
                        <FieldLabel htmlFor={inputId(field.name)}>
                          Passenger rail station
                        </FieldLabel>
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
                      />
                    </Field>
                  )}
                />

                <Controller
                  name="freightRailStation"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      orientation={"horizontal"}
                    >
                      <FieldContent>
                        <FieldLabel htmlFor={inputId(field.name)}>
                          Freight rail station
                        </FieldLabel>
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
                      />
                    </Field>
                  )}
                />

                <FieldSeparator />

                <Controller
                  name="laws"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={inputId(field.name)}>
                        Laws
                      </FieldLabel>

                      <MultiSelect
                        id={inputId(field.name)}
                        aria-invalid={fieldState.invalid}
                        options={
                          laws.map((law) => ({
                            value: law.id,
                            label: law.name,
                          })) || []
                        }
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder={`Choose ${lawsTitle.label.plural.toLowerCase()}...`}
                        hideSelectAll
                        variant={"secondary"}
                        disabled={isPending}
                        className="h-9 min-h-9"
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
                  name="respectForTheLaw"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      orientation={"horizontal"}
                    >
                      <FieldContent>
                        <FieldLabel htmlFor={inputId(field.name)}>
                          Respect for the law
                        </FieldLabel>
                        <FieldDescription>
                          Reduces bribery cost for local cops by 10%, increases
                          the effective duration of each bribe by 60 days and
                          reduces the likelihood of a police raid.
                        </FieldDescription>
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
                      />
                    </Field>
                  )}
                />
              </FieldGroup>
            </FieldSet>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <FieldSet>
              <FieldLegend>Boss information</FieldLegend>
              <FieldDescription>
                Set boss&apos;s name, nationality and traits.
              </FieldDescription>

              <FieldSeparator />

              <FieldGroup>
                <Controller
                  name="boss_first_name"
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
                  name="boss_last_name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={inputId(field.name)}>
                        Last name
                      </FieldLabel>
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
                  name="boss_nationality"
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
                            disabled={isPending}
                            className={cn(
                              "dark:bg-input/30 hover:dark:bg-accent justify-between bg-transparent shadow-xs",
                              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                            )}
                          >
                            {form.getValues("boss_nationality") ? (
                              <span className="flex items-center gap-2">
                                <CustomAvatar
                                  image={
                                    nationalities.find(
                                      (nationality) =>
                                        nationality.id ===
                                        form.getValues("boss_nationality"),
                                    )?.flag
                                  }
                                  className="size-6 rounded-md border-none"
                                  fit="contain"
                                />
                                {
                                  nationalities.find(
                                    (nationality) =>
                                      nationality.id ===
                                      form.getValues("boss_nationality"),
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
                                No{" "}
                                {nationalitiesTitle.label.singular.toLowerCase()}{" "}
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
                                          "boss_nationality",
                                          nationality.id ===
                                            form.getValues("boss_nationality")
                                            ? ""
                                            : nationality.id || "",
                                        );

                                        setComboxNationality(false);
                                        form.clearErrors("boss_nationality");
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
                                        form.getValues("boss_nationality") ===
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
                  name="boss_traits"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={inputId(field.name)}>
                        Traits
                      </FieldLabel>

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
                          })) || []
                        }
                        value={field.value}
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
              </FieldGroup>
            </FieldSet>
          </CardContent>
        </Card>

        <Card className="@2xl:col-span-2">
          <CardContent>
            <FieldSet>
              <FieldLegend>Social options</FieldLegend>
              <FieldDescription>Set app related options</FieldDescription>

              <FieldSeparator />

              <FieldGroup>
                <Controller
                  name="isPublic"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      orientation={"horizontal"}
                    >
                      <FieldContent>
                        <FieldLabel htmlFor={inputId(field.name)}>
                          Public
                        </FieldLabel>{" "}
                        <FieldDescription>
                          This will allow this playthrough to be featured on the
                          first page.
                        </FieldDescription>
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
          </CardContent>
        </Card>

        <div className="flex items-center justify-end @2xl:col-span-2">
          <CustomButton
            buttonLabel={`Add ${playthroughTitle.label.singular.toLowerCase()}`}
            type="submit"
            disabled={isPending}
            skeletonClassName="ms-auto w-32"
          />
        </div>
      </div>
    </form>
  );
};

export default AddPlaythroughForm;
