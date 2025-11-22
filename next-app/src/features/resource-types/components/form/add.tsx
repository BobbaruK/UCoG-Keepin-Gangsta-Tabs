"use client";

import Counter from "@/components/counter";
import { CustomButton } from "@/components/custom-button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { MESSAGES } from "@/constants/messages";
import { resourceTypesTitle } from "@/constants/page-title/resource-types";
import { formInputId } from "@/lib/utils/form-input-id";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { addResourceType } from "../../actions/add";
import { AddResourceTypeSchema } from "../../schemas/add-resource-type";

const AddResourceTypeForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof AddResourceTypeSchema>>({
    resolver: zodResolver(AddResourceTypeSchema),
    defaultValues: {
      name: "",
      capacity: 1,
    },
  });

  const { formId, inputId } = formInputId(
    `add-${resourceTypesTitle.label.singular.toLowerCase()}-form`,
  );

  const onSubmit = (values: z.infer<typeof AddResourceTypeSchema>) => {
    startTransition(async () => {
      addResourceType(values)
        .then(async (data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);
            router.push(resourceTypesTitle.href);
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
                  placeholder="Sack"
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
            name="capacity"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId(field.name)}>Capacity</FieldLabel>
                <div className="flex items-center gap-2">
                  <Input
                    {...field}
                    id={inputId(field.name)}
                    aria-invalid={fieldState.invalid}
                    placeholder="10"
                    autoComplete="off"
                    type="number"
                    disabled={true}
                    className="opacity-100!"
                    {...form.register("capacity", { valueAsNumber: true })}
                  />
                  <Counter
                    value={field.value}
                    emitClick={(val) => form.setValue("capacity", val)}
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
          buttonLabel={`Add ${resourceTypesTitle.label.singular.toLowerCase()}`}
          type="submit"
          className=""
          disabled={isPending}
          skeletonClassName="h-9 w-[148px]"
          variant={"success"}
        />
      </div>
    </form>
  );
};

export default AddResourceTypeForm;
