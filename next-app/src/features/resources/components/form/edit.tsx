"use client";

import { revPath } from "@/actions/revalidate";
import Counter from "@/components/counter";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { DIALOG_MESSAGES, MESSAGES } from "@/constants/messages";
import { resourcesTitle } from "@/constants/page-title/resources";
import {
  cog_resource,
  cog_resource_type,
  ResourceCategory,
} from "@/generated/prisma";
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
import { deleteResource } from "../../actions/delete";
import { editResource } from "../../actions/edit";
import { AddResourceSchema } from "../../schemas/add-resource";

interface Props {
  resource: cog_resource;
  resourceTypes: cog_resource_type[];
}

const EditResourceForm = ({ resource, resourceTypes }: Props) => {
  const [comboxResourceType, setComboxResourceType] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof AddResourceSchema>>({
    resolver: zodResolver(AddResourceSchema),
    defaultValues: {
      name: resource.name,
      image: resource.image || "",
      category: resource.category,
      price: resource.price,
      type: resource.cog_resource_typeId,
    },
  });

  const { formId, inputId } = formInputId(
    `add-${resourcesTitle.label.singular.toLowerCase()}-form`,
  );

  const resourceCategories = Object.values(ResourceCategory);

  const onSubmit = (values: z.infer<typeof AddResourceSchema>) => {
    startTransition(async () => {
      editResource(resource.id, values)
        .then(async (data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);
            router.push(resourcesTitle.href);
          }
        })
        .catch(() => {
          toast.error(MESSAGES.SOMETHING_WRONG);
        });
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      setOpenDeleteDialog(false);

      await deleteResource(resource.id)
        .then(async (data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);

            setTimeout(() => {
              revPath(resourcesTitle.href);
              router.push(resourcesTitle.href);
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
                  placeholder="Barley"
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
                  placeholder="/images/resources/barley.png"
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
            name="category"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId(field.name)}>Category</FieldLabel>

                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isPending}
                >
                  <SelectTrigger
                    id={inputId(field.name)}
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="Choose category" />
                  </SelectTrigger>
                  <SelectContent>
                    {resourceCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {capitalizeFirstLetter(category.toLowerCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="price"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId(field.name)}>Price</FieldLabel>
                <div className="flex items-center gap-2">
                  <Input
                    {...field}
                    id={inputId(field.name)}
                    aria-invalid={fieldState.invalid}
                    placeholder="30"
                    autoComplete="off"
                    type="number"
                    disabled={true}
                    className="opacity-100!"
                    {...form.register("price", { valueAsNumber: true })}
                  />
                  <Counter
                    value={field.value}
                    emitClick={(val) => form.setValue("price", val)}
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
            name="type"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId(field.name)}>Type</FieldLabel>

                <Popover
                  open={comboxResourceType}
                  onOpenChange={setComboxResourceType}
                >
                  <PopoverTrigger asChild>
                    <Button
                      {...field}
                      id={inputId(field.name)}
                      aria-invalid={fieldState.invalid}
                      variant="outline"
                      role="combobox"
                      aria-expanded={comboxResourceType}
                      className={cn(
                        "justify-between",
                        "dark:bg-input/30 hover:dark:bg-accent justify-between bg-transparent shadow-xs",
                        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                      )}
                      disabled={isPending}
                    >
                      {form.getValues("type")
                        ? resourceTypes?.find(
                            (type) => type.id === form.getValues("type"),
                          )?.name
                        : `Select type...`}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder={`Search type...`}
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No type found.</CommandEmpty>
                        <CommandGroup>
                          {resourceTypes?.map((type) => (
                            <CommandItem
                              key={type.id}
                              value={type.name}
                              onSelect={(currentValue) => {
                                const sideEffect = resourceTypes.find(
                                  (type) => type.name === currentValue,
                                );

                                if (sideEffect)
                                  form.setValue(
                                    "type",
                                    sideEffect.id === form.getValues("type")
                                      ? ""
                                      : sideEffect.id,
                                  );

                                setComboxResourceType(false);
                              }}
                            >
                              {type.name}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  form.getValues("type") === type.id
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
              resource: resourcesTitle.label.singular.toLowerCase(),
              resourceName: resource.name,
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
              onClick={handleDelete}
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
          buttonLabel={`Save ${resourcesTitle.label.singular.toLowerCase()}`}
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

export default EditResourceForm;

export function EditResourceFormSkeleton({
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
      <div className="flex flex-col justify-end gap-3">
        <Skeleton className="h-[19.25px] w-28" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="flex flex-wrap items-center justify-end gap-4">
        <Skeleton className="bg-destructive h-9 w-[89px]" />
        <Skeleton className="bg-muted h-9 w-[68px] border" />
        <Skeleton className="bg-success h-9 w-[128px]" />
      </div>
    </div>
  );
}
