"use client";

import { revPath } from "@/actions/revalidate";
import Counter from "@/components/counter";
import { CustomButton } from "@/components/custom-button";
import { TrashIcon } from "@/components/icons/trash";
import ResponsiveDialog from "@/components/responsive-dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { DIALOG_MESSAGES, MESSAGES } from "@/constants/messages";
import { buildingSizesTitle } from "@/constants/page-title/building-sizes";
import { BuildingSize } from "@/core/cog/building-size/types/building-size";
import { cn } from "@/lib/utils";
import { formInputId } from "@/lib/utils/form-input-id";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { deleteBuildingSize } from "../../actions/delete";
import { editBuildingSize } from "../../actions/edit";
import { AddBuildingSizeSchema } from "../../schemas/add-building-size";

interface Props {
  buildingSize: BuildingSize;
}

const EditBuildingBackroomForm = ({ buildingSize }: Props) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof AddBuildingSizeSchema>>({
    resolver: zodResolver(AddBuildingSizeSchema),
    defaultValues: {
      name: buildingSize.name,
      capacity: buildingSize.capacity,
    },
  });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const { formId, inputId } = formInputId(
    `edit-${buildingSizesTitle.label.singular.toLowerCase()}-form`,
  );

  const onSubmit = (values: z.infer<typeof AddBuildingSizeSchema>) => {
    startTransition(async () => {
      editBuildingSize(buildingSize.id, values)
        .then(async (data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);
            setTimeout(() => {
              revPath(buildingSizesTitle.href);
              router.push(buildingSizesTitle.href);
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

      await deleteBuildingSize(buildingSize.id)
        .then(async (data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);

            setTimeout(() => {
              revPath(buildingSizesTitle.href);
              router.push(buildingSizesTitle.href);
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
        </FieldGroup>
      </FieldSet>

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
                placeholder="1"
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
              resource: buildingSizesTitle.label.singular.toLowerCase(),
              resourceName: buildingSize.name,
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
          buttonLabel={`Save ${buildingSizesTitle.label.singular.toLowerCase()}`}
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

export default EditBuildingBackroomForm;

export function EditBuildingBackroomFormSkeleton({
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

      <div className="flex flex-wrap items-center justify-end gap-4">
        <Skeleton className="bg-destructive h-9 w-[89px]" />
        <Skeleton className="bg-muted h-9 w-[68px] border" />
        <Skeleton className="bg-success h-9 w-[145px]" />
      </div>
    </div>
  );
}
