"use client";

import { revPath } from "@/actions/revalidate";
import Counter from "@/components/counter";
import { CustomAvatar } from "@/components/custom-avatar";
import { CustomButton } from "@/components/custom-button";
import { BuildingPassiveIcon } from "@/components/icons/building-passive";
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
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { DIALOG_MESSAGES, MESSAGES } from "@/constants/messages";
import { buildingPassiveTitle } from "@/constants/page-title/building-passive";
import { resourcesTitle } from "@/constants/page-title/resources";
import { BuildingPassive } from "@/core/cog/building-passive/types/building-passive-duration";
import { Resource } from "@/core/cog/resource/types/resource";
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
import { deleteBuildingPassive } from "../../actions/delete";
import { editBuildingPassive } from "../../actions/edit";
import { AddBuildingPassiveSchema } from "../../schemas/add-building-passive";

interface Props {
  buildingPassive: BuildingPassive;
  resources?: Resource[];
}

const EditBuildingPassiveForm = ({
  buildingPassive,
  resources = [],
}: Props) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof AddBuildingPassiveSchema>>({
    resolver: zodResolver(AddBuildingPassiveSchema),
    defaultValues: {
      quantity: buildingPassive.quantity,
      resource: buildingPassive.resourceId,
    },
  });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [comboxResource, setComboxResource] = useState(false);

  const { formId, inputId } = formInputId(
    `edit-${buildingPassiveTitle.label.singular.toLowerCase()}-form`,
  );

  const onSubmit = (values: z.infer<typeof AddBuildingPassiveSchema>) => {
    startTransition(async () => {
      editBuildingPassive(buildingPassive.id, values)
        .then(async (data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);
            setTimeout(() => {
              revPath(buildingPassiveTitle.href);
              router.push(buildingPassiveTitle.href);
            }, 250);
          }
        })
        .catch(() => {
          toast.error(MESSAGES.SOMETHING_WRONG);
        });
    });
  };

  const handleDeleteCaptainRole = () => {
    startTransition(async () => {
      setOpenDeleteDialog(false);

      await deleteBuildingPassive(buildingPassive.id)
        .then(async (data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);

            setTimeout(() => {
              revPath(buildingPassiveTitle.href);
              router.push(buildingPassiveTitle.href);
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
      <Controller
        name="quantity"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={inputId(field.name)}>Quantity</FieldLabel>
            <div className="flex items-center gap-2">
              <Input
                {...field}
                id={inputId(field.name)}
                aria-invalid={fieldState.invalid}
                placeholder="1"
                autoComplete="off"
                type="number"
                disabled={true}
                className="opacity-100!"
                {...form.register("quantity", { valueAsNumber: true })}
              />
              <Counter
                value={field.value}
                emitClick={(val) => form.setValue("quantity", val)}
                minValue={1}
                isPending={isPending}
              />
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="resource"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={inputId(field.name)}>
              {capitalizeFirstLetter(
                resourcesTitle.label.singular.toLowerCase(),
              )}
            </FieldLabel>

            <Popover open={comboxResource} onOpenChange={setComboxResource}>
              <PopoverTrigger asChild>
                <Button
                  {...field}
                  id={inputId(field.name)}
                  aria-invalid={fieldState.invalid}
                  variant="outline"
                  role="combobox"
                  aria-expanded={comboxResource}
                  className={cn(
                    "dark:bg-input/30 hover:dark:bg-accent justify-between bg-transparent shadow-xs",
                    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                  )}
                  disabled={isPending}
                >
                  {form.getValues("resource") ? (
                    <span className="flex items-center gap-2">
                      <CustomAvatar
                        image={
                          resources.find(
                            (resource) =>
                              resource.id === form.getValues("resource"),
                          )?.image
                        }
                        icon={
                          <BuildingPassiveIcon className="text-foreground" />
                        }
                        className="size-6 rounded-md border-none"
                        fit="contain"
                      />
                      {
                        resources.find(
                          (resource) =>
                            resource.id === form.getValues("resource"),
                        )?.name
                      }
                    </span>
                  ) : (
                    `Select ${resourcesTitle.label.singular.toLowerCase()}...`
                  )}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder={`Search ${resourcesTitle.label.singular.toLowerCase()}...`}
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>
                      No {resourcesTitle.label.singular.toLowerCase()} found.
                    </CommandEmpty>
                    <CommandGroup>
                      {resources
                        .filter(
                          (resource) =>
                            resource.name.toLowerCase() !== "unassigned",
                        )
                        .map((role) => (
                          <CommandItem
                            key={role.id}
                            value={role.name}
                            onSelect={(currentValue) => {
                              const resource = resources.find(
                                (resource) => resource.name === currentValue,
                              );

                              form.setValue(
                                "resource",
                                resource &&
                                  resource.id === form.getValues("resource")
                                  ? ""
                                  : resource?.id || "",
                              );
                              setComboxResource(false);
                            }}
                          >
                            <CustomAvatar
                              image={role.image}
                              className="size-6 rounded-md border-none"
                              fit="contain"
                            />
                            {role.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                form.getValues("resource") === role.id
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

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

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
              resource: buildingPassiveTitle.label.singular.toLowerCase(),
              resourceName: `${buildingPassive.resource.name} (${buildingPassive.quantity})`,
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
              onClick={handleDeleteCaptainRole}
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
          buttonLabel={`Save ${buildingPassiveTitle.label.singular.toLowerCase()}`}
          type="submit"
          className=""
          disabled={isPending}
          skeletonClassName="bg-accent h-9 w-[140px]"
          variant={"success"}
        />
      </div>
    </form>
  );
};

export default EditBuildingPassiveForm;

export function EditBuildingPassiveFormSkeleton({
  className,
  ...restProps
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-7", className)} {...restProps}>
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
        <Skeleton className="bg-success h-9 w-[242px]" />
      </div>
    </div>
  );
}
