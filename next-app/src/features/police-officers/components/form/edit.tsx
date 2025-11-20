"use client";

import Counter from "@/components/counter";
import { CustomButton } from "@/components/custom-button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { MESSAGES } from "@/constants/messages";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { policeOfficersTitle } from "@/constants/page-title/police-officers";
import { PoliceOfficer } from "@/core/db/police-officer/types/police-officer";
import { cn } from "@/lib/utils";
import { formInputId } from "@/lib/utils/form-input-id";
import { dateFormatter, turnToDate } from "@/lib/utils/format-date";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { editPoliceOfficer } from "../../actions/edit";
import { AddPoliceOfficerSchema } from "../../schemas/add";

interface Props {
  policeOfficer: PoliceOfficer;
}

const EditPoliceOfficerForm = ({ policeOfficer }: Props) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof AddPoliceOfficerSchema>>({
    resolver: zodResolver(AddPoliceOfficerSchema),
    defaultValues: {
      name: policeOfficer.name,
      bribedTurn: policeOfficer.bribed_turn,
      can_call_in_a_raid: policeOfficer.can_call_in_a_raid,
      has_rival_hooligan_relative: policeOfficer.has_rival_hooligan_relative,
      political_contact_used: policeOfficer.political_contact_used,
    },
  });

  const turns = useWatch({
    control: form.control,
    name: "bribedTurn", // without supply name will watch the entire form, or ['firstName', 'lastName'] to watch both
  });

  const { formId, inputId } = formInputId(
    `edit-${policeOfficersTitle.label.singular.toLowerCase()}-form`,
  );

  const onSubmit = (values: z.infer<typeof AddPoliceOfficerSchema>) => {
    startTransition(async () => {
      editPoliceOfficer(policeOfficer, values)
        .then(async (data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);
            router.push(
              `${playthroughTitle.href}/${policeOfficer.cog_playthroughId + policeOfficersTitle.href}`,
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
                  placeholder="Marian Jackson"
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
            name="bribedTurn"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId(field.name)}>
                  Bribed turn (
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
                    placeholder="213"
                    autoComplete="off"
                    type="number"
                    disabled={true}
                    className="opacity-100!"
                    {...form.register("bribedTurn", { valueAsNumber: true })}
                  />
                  <Counter
                    value={field.value}
                    emitClick={(val) => form.setValue("bribedTurn", val)}
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
            name="can_call_in_a_raid"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                orientation={"horizontal"}
              >
                <FieldContent>
                  <FieldLabel htmlFor={inputId(field.name)}>
                    Can call in a raid
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
            name="has_rival_hooligan_relative"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                orientation={"horizontal"}
              >
                <FieldContent>
                  <FieldLabel htmlFor={inputId(field.name)}>
                    Has a rival or hooligan relative?
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
            name="political_contact_used"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                orientation={"horizontal"}
              >
                <FieldContent>
                  <FieldLabel htmlFor={inputId(field.name)}>
                    Political contact used?
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
        </FieldGroup>
      </FieldSet>

      <CustomButton
        buttonLabel={`Save ${policeOfficersTitle.label.singular.toLowerCase()}`}
        type="submit"
        className="ms-auto"
        disabled={isPending}
        skeletonClassName="ms-auto w-32"
      />
    </form>
  );
};

export default EditPoliceOfficerForm;

export function EditPoliceOfficerFormSkeleton({
  className,
  ...restProps
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-7", className)} {...restProps}>
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
      <div className="flex justify-between gap-3">
        <Skeleton className="h-[19.25px] w-28" />
        <Skeleton className="h-[19.25px] w-8 rounded-4xl" />
      </div>
      <div className="flex justify-between gap-3">
        <Skeleton className="h-[19.25px] w-28" />
        <Skeleton className="h-[19.25px] w-8 rounded-4xl" />
      </div>
      <div className="flex justify-between gap-3">
        <Skeleton className="h-[19.25px] w-28" />
        <Skeleton className="h-[19.25px] w-8 rounded-4xl" />
      </div>
      <Skeleton className="ms-auto h-9 w-[147px]" />
    </div>
  );
}
