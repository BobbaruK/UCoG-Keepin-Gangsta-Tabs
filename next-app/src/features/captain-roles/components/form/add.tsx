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
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { MESSAGES } from "@/constants/messages";
import { captainRolesTitle } from "@/constants/page-title/captain-roles";
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
import { addCaptainRole } from "../../actions/add";
import { AddCaptainRoleSchema } from "../../schemas/add-captain-role";

interface Props {
  sideEffects: cog_side_effect[] | undefined;
}

const AddCaptainRoleForm = ({ sideEffects }: Props) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof AddCaptainRoleSchema>>({
    resolver: zodResolver(AddCaptainRoleSchema),
    defaultValues: {
      name: "",
      image: "",
      description: "",
      sideEffect: "",
    },
  });
  const [comboxSideEffect, setComboxSideEffect] = useState(false); // TODO: move this state in a separate component

  const { formId, inputId } = formInputId(
    `add-${captainRolesTitle.label.singular.toLowerCase()}-form`,
  );

  const onSubmit = (values: z.infer<typeof AddCaptainRoleSchema>) => {
    startTransition(async () => {
      addCaptainRole(values)
        .then(async (data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);
            router.push(captainRolesTitle.href);
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
                  placeholder="Intimidator"
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
                  placeholder="/images/captains/intimidator.png"
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
          buttonLabel={`Add ${captainRolesTitle.label.singular.toLowerCase()}`}
          type="submit"
          className=""
          disabled={isPending}
          skeletonClassName="h-9 w-[137px]"
          variant={"success"}
        />
      </div>
    </form>
  );
};

export default AddCaptainRoleForm;

export function AddCaptainRoleFormSkeleton({
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
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="flex flex-col justify-end gap-3">
        <Skeleton className="h-[19.25px] w-28" />
        <Skeleton className="h-16 w-full" />
      </div>
      <div className="flex flex-col justify-end gap-3">
        <Skeleton className="h-[19.25px] w-28" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="flex flex-wrap items-center justify-end gap-4">
        <Skeleton className="bg-muted h-9 w-[68px] border" />
        <Skeleton className="bg-success h-9 w-[137px]" />
      </div>
    </div>
  );
}
