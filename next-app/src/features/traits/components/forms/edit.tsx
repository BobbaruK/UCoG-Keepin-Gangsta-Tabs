"use client";

import { revPath } from "@/actions/revalidate";
import { CustomButton } from "@/components/custom-button";
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
import { DIALOG_MESSAGES, MESSAGES } from "@/constants/messages";
import { traitsTitle } from "@/constants/page-title/traits";
import { deleteTrait } from "@/features/traits/actions/delete";
import { editTrait } from "@/features/traits/actions/edit";
import { AddTraitSchema } from "@/features/traits/schemas/add-trait";
import { cog_side_effect, cog_trait } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { formInputId } from "@/lib/utils/form-input-id";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface Props {
  trait: cog_trait;
  sideEffects: cog_side_effect[] | undefined;
}

const EditTraitForm = ({ trait, sideEffects }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof AddTraitSchema>>({
    resolver: zodResolver(AddTraitSchema),
    defaultValues: {
      name: trait.name,
      description: trait.description || "",
      image: trait.image || "",
      sideEffect: trait.cog_side_effectId || "",
    },
  });
  const [comboxSideEffect, setComboxSideEffect] = useState(false); // TODO: move this state in a separate component

  const { formId, inputId } = formInputId(
    `edit-${traitsTitle.label.singular}-form`,
  );

  const onSubmit = (values: z.infer<typeof AddTraitSchema>) => {
    startTransition(async () => {
      editTrait(trait.id, values)
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

  const handleDeleteTraits = () => {
    startTransition(async () => {
      setOpenDeleteDialog(false);

      await deleteTrait(trait.id)
        .then(async (data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);

            setTimeout(() => {
              revPath(traitsTitle.href);
              router.push(traitsTitle.href);
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
              resource: traitsTitle.label.singular.toLowerCase(),
              resourceName: trait.name,
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
              onClick={handleDeleteTraits}
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
          buttonLabel={`Save ${traitsTitle.label.singular.toLowerCase()}`}
          type="submit"
          className="h-9 w-32"
          disabled={isPending}
          skeletonClassName="h-9 w-32"
          variant={"success"}
        />
      </div>
    </form>
  );
};

export default EditTraitForm;

export function EditTraitFormSkeleton({
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
        <Skeleton className="bg-destructive h-9 w-[89px]" />
        <Skeleton className="bg-muted h-9 w-[68px] border" />
        <Skeleton className="bg-success h-9 w-32" />
      </div>
    </div>
  );
}
