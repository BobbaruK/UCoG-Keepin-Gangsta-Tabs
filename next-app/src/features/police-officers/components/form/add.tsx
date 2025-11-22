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
import { Switch } from "@/components/ui/switch";
import { MESSAGES } from "@/constants/messages";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { policeOfficersTitle } from "@/constants/page-title/police-officers";
import { formInputId } from "@/lib/utils/form-input-id";
import { dateFormatter, turnToDate } from "@/lib/utils/format-date";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { addPoliceOfficer } from "../../actions/add";
import { AddPoliceOfficerSchema } from "../../schemas/add";

interface Props {
  playthroughId: string;
}

const AddPoliceOfficerForm = ({ playthroughId }: Props) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof AddPoliceOfficerSchema>>({
    resolver: zodResolver(AddPoliceOfficerSchema),
    defaultValues: {
      name: "",
      bribedTurn: 1,
      can_call_in_a_raid: false,
      has_rival_hooligan_relative: false,
      political_contact_used: false,
    },
  });

  const turns = useWatch({
    control: form.control,
    name: "bribedTurn", // without supply name will watch the entire form, or ['firstName', 'lastName'] to watch both
  });

  const { formId, inputId } = formInputId(
    `add-${policeOfficersTitle.label.singular.toLowerCase()}-form`,
  );

  const onSubmit = (values: z.infer<typeof AddPoliceOfficerSchema>) => {
    startTransition(async () => {
      addPoliceOfficer({
        playthroughId,
        values,
      })
        .then(async (data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);
            router.push(
              `${playthroughTitle.href}/${playthroughId + policeOfficersTitle.href}`,
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
          buttonLabel={`Add ${policeOfficersTitle.label.singular.toLowerCase()}`}
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

export default AddPoliceOfficerForm;
