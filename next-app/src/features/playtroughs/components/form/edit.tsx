"use client";

import { CustomButton } from "@/components/custom-button";
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
import { Switch } from "@/components/ui/switch";
import { MESSAGES } from "@/constants/messages";
import { lawsTitle } from "@/constants/page-title/laws";
import { playthroughTitle } from "@/constants/page-title/playtrough";
import { cog_law, cog_playthrough } from "@/generated/prisma";
import { formInputId } from "@/lib/utils/form-input-id";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { editPlaythrough } from "../../actions/edit";
import { AddPlaythroughSchema } from "../../schemas/add";
import { Playthrough } from "../../types/playthrough";

interface Props {
  playthrough: Playthrough;
  laws: cog_law[] | undefined;
}

const EditPlaythroughForm = ({ playthrough, laws }: Props) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof AddPlaythroughSchema>>({
    resolver: zodResolver(AddPlaythroughSchema),
    defaultValues: {
      name: playthrough.name,
      seed: playthrough.seed || "",
      isPublic: playthrough.is_public,
      freightRailStation: playthrough.freight_rail_station,
      passengerRailStation: playthrough.passenger_rail_station,
      respectForTheLaw: playthrough.respect_for_the_law,
      laws: playthrough.laws.map((law) => law.id),
    },
  });

  const { formId, inputId } = formInputId(
    `edit-${playthroughTitle.label.singular.toLowerCase()}-form`,
  );

  const onSubmit = (values: z.infer<typeof AddPlaythroughSchema>) => {
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
    <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
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
            name="isPublic"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                orientation={"horizontal"}
              >
                <FieldContent>
                  <FieldLabel htmlFor={inputId(field.name)}>Public</FieldLabel>
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
                    Reduces bribery cost for local cops by 10%, increases the
                    effective duration of each bribe by 60 days and reduces the
                    likelihood of a police raid.
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
                    laws?.map((law) => ({
                      value: law.id,
                      label: law.name,
                    })) || []
                  }
                  // value={field.value}
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
                  }}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/*  */}

          <CustomButton
            buttonLabel={`Save ${playthroughTitle.label.singular.toLowerCase()}`}
            type="submit"
            className="ms-auto"
            disabled={isPending}
            skeletonClassName="ms-auto w-32"
          />
        </FieldGroup>
      </FieldSet>
    </form>
  );
};

export default EditPlaythroughForm;
