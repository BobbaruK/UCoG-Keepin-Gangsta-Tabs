"use client";

import { CustomButton } from "@/components/custom-button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Switch } from "@/components/ui/switch";
import { MESSAGES } from "@/constants/messages";
import { lawsTitle } from "@/constants/page-title/laws";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { Playthrough } from "@/core/db/playthrough/types/playthrough";
import { cog_law } from "@/generated/prisma";
import { formInputId } from "@/lib/utils/form-input-id";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { editPlaythrough } from "../../actions/edit";
import { EditPlaythroughSchema } from "../../schemas/edit-playthrough";

interface Props {
  playthrough: Playthrough;
  laws: cog_law[] | undefined;
}

const EditPlaythroughForm = ({ playthrough, laws = [] }: Props) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof EditPlaythroughSchema>>({
    resolver: zodResolver(EditPlaythroughSchema),
    defaultValues: {
      name: playthrough.name,
      seed: playthrough.seed || "",
      freightRailStation: playthrough.freight_rail_station,
      passengerRailStation: playthrough.passenger_rail_station,
      respectForTheLaw: playthrough.respect_for_the_law,
      laws: playthrough.laws.map((law) => law.id),

      isPublic: playthrough.is_public,
      isFinished: playthrough.is_finished,
    },
  });

  const { formId, inputId } = formInputId(
    `edit-${playthroughTitle.label.singular.toLowerCase()}-form`,
  );

  const onSubmit = (values: z.infer<typeof EditPlaythroughSchema>) => {
    startTransition(async () => {
      editPlaythrough(playthrough, values)
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
      className="flex flex-col gap-7"
    >
      <Card>
        <CardContent>
          <FieldSet>
            <FieldLegend>Playthrough information</FieldLegend>
            <FieldDescription>
              Edit name, seed and other options.
            </FieldDescription>

            <FieldSeparator />

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
                    <FieldLabel htmlFor={inputId(field.name)}>Seed</FieldLabel>
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
                      disabled={isPending}
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
                      disabled={isPending}
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
                    <FieldLabel htmlFor={inputId(field.name)}>Laws</FieldLabel>

                    <MultiSelect
                      id={inputId(field.name)}
                      aria-invalid={fieldState.invalid}
                      options={
                        laws.map((law) => ({
                          value: law.id,
                          label: law.name,
                        })) || []
                      }
                      defaultValue={field.value}
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
                      disabled={isPending}
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
            <FieldLegend>Social options</FieldLegend>
            <FieldDescription>Set app related options</FieldDescription>

            <FieldSeparator />

            <FieldGroup>
              <Controller
                name="isFinished"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    orientation={"horizontal"}
                  >
                    <FieldContent>
                      <FieldLabel htmlFor={inputId(field.name)}>
                        Is finished
                      </FieldLabel>{" "}
                      <FieldDescription>
                        This will freeze your playthrough. You will cannot add
                        new crew members, buildings, etc.
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

              <FieldSeparator />

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

      <CustomButton
        buttonLabel={`Save ${playthroughTitle.label.singular.toLowerCase()}`}
        type="submit"
        className="ms-auto"
        disabled={isPending}
        skeletonClassName="ms-auto w-32"
      />
    </form>
  );
};

export default EditPlaythroughForm;
