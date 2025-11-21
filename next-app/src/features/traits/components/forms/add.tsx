"use client";

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
import { traitsTitle } from "@/constants/page-title/traits";
import { addTrait } from "@/features/traits/actions/add";
import { cog_side_effect } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { formInputId } from "@/lib/utils/form-input-id";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { AddTraitSchema } from "../../schemas/add-trait";

interface Props {
  sideEffects: cog_side_effect[] | undefined;
}

const AddTraitForm = ({ sideEffects }: Props) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof AddTraitSchema>>({
    resolver: zodResolver(AddTraitSchema),
    defaultValues: {
      name: "",
      description: "",
      image: "",
      sideEffect: "",
    },
  });
  const [comboxSideEffect, setComboxSideEffect] = useState(false); // TODO: move this state in a separate component

  const { formId, inputId } = formInputId(
    `add-${traitsTitle.label.singular.toLowerCase()}-form`,
  );

  const onSubmit = (values: z.infer<typeof AddTraitSchema>) => {
    startTransition(async () => {
      addTrait(values)
        .then(async (data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);
            router.push(traitsTitle.href);
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
                  placeholder="Aggressive"
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
            name="image"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId(field.name)}>Image</FieldLabel>
                <Input
                  {...field}
                  id={inputId(field.name)}
                  aria-invalid={fieldState.invalid}
                  placeholder="/images/traits/aggressive.png"
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
                      className={cn(
                        "w-[200px] justify-between",
                        "dark:bg-input/30 hover:dark:bg-accent justify-between bg-transparent shadow-xs",
                        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                      )}
                      disabled={isPending}
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
          buttonLabel={`Add ${traitsTitle.label.singular.toLowerCase()}`}
          type="submit"
          className=""
          disabled={isPending}
          skeletonClassName="h-9 w-[88px]"
          variant={'success'}
        />
      </div>
    </form>
  );
};

export default AddTraitForm;
