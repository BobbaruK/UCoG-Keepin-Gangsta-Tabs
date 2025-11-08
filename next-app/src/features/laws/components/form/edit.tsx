"use client";

import Counter from "@/components/counter";
import { CustomButton } from "@/components/custom-button";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { MESSAGES } from "@/constants/messages";
import { lawsTitle } from "@/constants/page-title/laws";
import { cog_law, cog_side_effect, LawType } from "@/generated/prisma";
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
import { editLaw } from "../../actions/edit";
import { AddLawSchema } from "../../schemas/add-law";

interface Props {
  law: cog_law;
  sideEffects: cog_side_effect[] | undefined;
}

const EditLawForm = ({ law, sideEffects }: Props) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof AddLawSchema>>({
    resolver: zodResolver(AddLawSchema),
    defaultValues: {
      name: law.name,
      description: law.description || "",
      enact: law.enact,
      revoke: law.revoke,
      type: law.type,
      sideEffect: law.cog_side_effectId || "",
    },
  });
  const [comboxSideEffect, setComboxSideEffect] = useState(false); // TODO: move this state in a separate component
  const [comboxType, setComboxType] = useState(false); // TODO: move this state in a separate component

  const { formId, inputId } = formInputId(
    `edit-${lawsTitle.label.singular.toLowerCase()}-form`,
  );
  const lawTypes = Object.values(LawType);

  const onSubmit = (values: z.infer<typeof AddLawSchema>) => {
    startTransition(async () => {
      editLaw(law.id, values)
        .then(async (data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);
            router.push(lawsTitle.href);
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
                  placeholder="Ceramics Subsidies"
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
            name="type"
            control={form.control}
            render={({ field, fieldState }) => (
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
                      aria-expanded={comboxSideEffect}
                      className="w-[200px] justify-between"
                    >
                      {form.getValues("type")
                        ? capitalizeFirstLetter(
                            lawTypes?.find(
                              (type) => type === form.getValues("type"),
                            ) || "",
                          )
                        : `Select ${lawsTitle.label.singular.toLowerCase()}...`}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder={`Search ${lawsTitle.label.singular.toLowerCase()}...`}
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>
                          No {lawsTitle.label.singular.toLowerCase()} found.
                        </CommandEmpty>
                        <CommandGroup>
                          {lawTypes?.map((law) => (
                            <CommandItem
                              key={law}
                              value={law}
                              onSelect={(currentValue) => {
                                form.setValue("type", law);
                                setComboxType(false);
                              }}
                            >
                              {capitalizeFirstLetter(law)}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  form.getValues("type") === law
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
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="md:col-span-2"
              >
                <FieldLabel htmlFor={inputId(field.name)}>
                  Description
                </FieldLabel>
                <Textarea
                  {...field}
                  aria-invalid={fieldState.invalid}
                  id={inputId(field.name)}
                  placeholder="Write a small and meaningful description."
                  rows={4}
                  disabled={isPending}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="enact"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId(field.name)}>Enact</FieldLabel>
                <div className="flex items-center gap-2">
                  <Input
                    {...field}
                    id={inputId(field.name)}
                    aria-invalid={fieldState.invalid}
                    placeholder="12"
                    autoComplete="off"
                    type="number"
                    {...form.register("enact", { valueAsNumber: true })}
                    disabled={isPending}
                  />
                  <Counter
                    value={field.value}
                    emitClick={(val) => form.setValue("enact", val)}
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="revoke"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId(field.name)}>Revoke</FieldLabel>
                <div className="flex items-center gap-2">
                  <Input
                    {...field}
                    id={inputId(field.name)}
                    aria-invalid={fieldState.invalid}
                    placeholder="12"
                    autoComplete="off"
                    type="number"
                    {...form.register("revoke", { valueAsNumber: true })}
                    disabled={isPending}
                  />
                  <Counter
                    value={field.value}
                    emitClick={(val) => form.setValue("revoke", val)}
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="sideEffect"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId(field.name)}>
                  Side effect
                </FieldLabel>

                <Popover
                  open={comboxSideEffect}
                  onOpenChange={setComboxSideEffect}
                >
                  <PopoverTrigger asChild>
                    <Button
                      {...field}
                      id={inputId(field.name)}
                      aria-invalid={fieldState.invalid}
                      variant="outline"
                      role="combobox"
                      aria-expanded={comboxSideEffect}
                      className="w-[200px] justify-between"
                    >
                      {form.getValues("sideEffect")
                        ? sideEffects?.find(
                            (sideEffect) =>
                              sideEffect.id === form.getValues("sideEffect"),
                          )?.name
                        : "Select side effect..."}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Search side effect..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No side effect found.</CommandEmpty>
                        <CommandGroup>
                          {sideEffects?.map((sideEffect) => (
                            <CommandItem
                              key={sideEffect.id}
                              value={sideEffect.name}
                              onSelect={(currentValue) => {
                                const sideEffect = sideEffects.find(
                                  (sideEffect) =>
                                    sideEffect.name === currentValue,
                                );

                                form.setValue(
                                  "sideEffect",
                                  sideEffect &&
                                    sideEffect?.id ===
                                      form.getValues("sideEffect")
                                    ? ""
                                    : sideEffect?.id,
                                );
                                setComboxSideEffect(false);
                              }}
                            >
                              {sideEffect.name}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  form.getValues("sideEffect") === sideEffect.id
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

          <CustomButton
            buttonLabel={`Save ${lawsTitle.label.singular.toLowerCase()}`}
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

export default EditLawForm;
