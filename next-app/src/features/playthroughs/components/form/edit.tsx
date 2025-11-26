"use client";

import { revPath } from "@/actions/revalidate";
import { CustomButton } from "@/components/custom-button";
import { TrashIcon } from "@/components/icons/trash";
import ResponsiveDialog from "@/components/responsive-dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { DIALOG_MESSAGES, MESSAGES } from "@/constants/messages";
import { lawsTitle } from "@/constants/page-title/laws";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { Playthrough } from "@/core/db/playthrough/types/playthrough";
import { cog_law } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { formInputId } from "@/lib/utils/form-input-id";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { deletePlaythrough } from "../../actions/delete";
import { editPlaythrough } from "../../actions/edit";
import {
  PLAYTHROUGH_CARD_INFO,
  PLAYTHROUGH_SOCIAL_CARD_INFO,
} from "../../constants/misc";
import { EditPlaythroughSchema } from "../../schemas/edit-playthrough";

interface Props {
  playthrough: Playthrough;
  laws: cog_law[] | undefined;
}

const EditPlaythroughForm = ({ playthrough, laws = [] }: Props) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const form = useForm<z.infer<typeof EditPlaythroughSchema>>({
    resolver: zodResolver(EditPlaythroughSchema),
    defaultValues: {
      name: playthrough.name,
      seed: playthrough.seed || "",
      freightRailStation: playthrough.freight_rail_station,
      passengerRailStation: playthrough.passenger_rail_station,
      respectForTheLaw: playthrough.respect_for_the_law,
      laws: playthrough.laws.map((law) => law.id),

      isPublic: playthrough.is_public,
      isFinished: playthrough.is_finished,
    },
  });

  const { formId, inputId } = formInputId(
    `edit-${playthroughTitle.label.singular.toLowerCase()}-form`,
  );

  const onSubmit = (values: z.infer<typeof EditPlaythroughSchema>) => {
    startTransition(async () => {
      editPlaythrough(playthrough, values)
        .then(async (data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);
            router.push(playthroughTitle.href);
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

      await deletePlaythrough(playthrough)
        .then(async (data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);

            setTimeout(() => {
              revPath(playthroughTitle.href);
              router.push(playthroughTitle.href);
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
      <Card>
        <CardContent>
          <FieldSet>
            <FieldLegend>{PLAYTHROUGH_CARD_INFO.title}</FieldLegend>
            <FieldDescription>
              {PLAYTHROUGH_CARD_INFO.description}
            </FieldDescription>

            <FieldSeparator />

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
                      placeholder="Chicago - Adam Williams"
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
                name="seed"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={inputId(field.name)}>Seed</FieldLabel>
                    <Input
                      {...field}
                      id={inputId(field.name)}
                      aria-invalid={fieldState.invalid}
                      placeholder="1234567890"
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
                name="laws"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={inputId(field.name)}>Laws</FieldLabel>

                    <MultiSelect
                      id={inputId(field.name)}
                      aria-invalid={fieldState.invalid}
                      options={
                        laws.map((law) => ({
                          value: law.id,
                          label: law.name,
                        })) || []
                      }
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder={`Choose ${lawsTitle.label.plural.toLowerCase()}...`}
                      hideSelectAll
                      variant={"secondary"}
                      disabled={isPending}
                      className="h-9 min-h-9"
                      animationConfig={{
                        badgeAnimation: "slide",
                        optionHoverAnimation: "none",
                        popoverAnimation: "none",
                      }}
                      responsive={{
                        mobile: {
                          maxCount: 0,
                        },
                        tablet: {
                          compactMode: true,
                          maxCount: 1,
                        },
                        desktop: {
                          maxCount: 2,
                        },
                      }}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="passengerRailStation"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    orientation={"horizontal"}
                  >
                    <FieldContent>
                      <FieldLabel htmlFor={inputId(field.name)}>
                        Passenger rail station
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
                    />
                  </Field>
                )}
              />

              <FieldSeparator />

              <Controller
                name="freightRailStation"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    orientation={"horizontal"}
                  >
                    <FieldContent>
                      <FieldLabel htmlFor={inputId(field.name)}>
                        Freight rail station
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
                    />
                  </Field>
                )}
              />

              <FieldSeparator />

              <Controller
                name="respectForTheLaw"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    orientation={"horizontal"}
                  >
                    <FieldContent>
                      <FieldLabel htmlFor={inputId(field.name)}>
                        Respect for the law
                      </FieldLabel>
                      <FieldDescription>
                        Reduces bribery cost for local cops by 10%, increases
                        the effective duration of each bribe by 60 days and
                        reduces the likelihood of a police raid.
                      </FieldDescription>
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
                    />
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <FieldSet>
            <FieldLegend>{PLAYTHROUGH_SOCIAL_CARD_INFO.title}</FieldLegend>
            <FieldDescription>
              {PLAYTHROUGH_SOCIAL_CARD_INFO.description}
            </FieldDescription>

            <FieldSeparator />

            <FieldGroup>
              <Controller
                name="isFinished"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    orientation={"horizontal"}
                  >
                    <FieldContent>
                      <FieldLabel htmlFor={inputId(field.name)}>
                        Is finished
                      </FieldLabel>{" "}
                      <FieldDescription>
                        This will freeze your playthrough. You will cannot add
                        new crew members, buildings, etc.
                      </FieldDescription>
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
                name="isPublic"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    orientation={"horizontal"}
                  >
                    <FieldContent>
                      <FieldLabel htmlFor={inputId(field.name)}>
                        Public
                      </FieldLabel>{" "}
                      <FieldDescription>
                        This will allow this playthrough to be featured on the
                        first page.
                      </FieldDescription>
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
        </CardContent>
      </Card>

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
              resource: playthroughTitle.label.singular.toLowerCase(),
              resourceName: playthrough.name,
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
          buttonLabel={`Save ${playthroughTitle.label.singular.toLowerCase()}`}
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

export default EditPlaythroughForm;

export function EditPlaythroughFormSkeleton({
  className,
  ...restProps
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-7", className)} {...restProps}>
      <Card>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col">
            <FieldLegend>{PLAYTHROUGH_CARD_INFO.title}</FieldLegend>
            <FieldDescription>
              {PLAYTHROUGH_CARD_INFO.description}
            </FieldDescription>
          </div>
          <FieldSeparator />
          <div className="flex flex-col gap-7">
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
            <div className="flex items-center justify-between">
              <Skeleton className="h-[19.25px] w-28" />
              <Skeleton className="h-[18.39px] w-8 rounded-2xl" />
            </div>
            <FieldSeparator />
            <div className="flex items-center justify-between">
              <Skeleton className="h-[19.25px] w-28" />
              <Skeleton className="h-[18.39px] w-8 rounded-2xl" />
            </div>
            <FieldSeparator />
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Skeleton className="h-[19.25px] w-28" />
                <Skeleton className="h-[18.39px] w-8 rounded-2xl" />
              </div>
              <div className="space-y-0.5">
                <Skeleton className="h-[21px] w-full max-w-3/4" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="@2xl:col-span-2">
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col">
            <FieldLegend>{PLAYTHROUGH_SOCIAL_CARD_INFO.title}</FieldLegend>
            <FieldDescription>
              {PLAYTHROUGH_SOCIAL_CARD_INFO.description}
            </FieldDescription>
          </div>
          <FieldSeparator />

          <div className="flex flex-col gap-7">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Skeleton className="h-[19.25px] w-28" />
                <Skeleton className="h-[18.39px] w-8 rounded-2xl" />
              </div>
              <div className="space-y-0.5">
                <Skeleton className="h-[21px] w-full max-w-3/4" />
              </div>
            </div>

            <FieldSeparator />

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Skeleton className="h-[19.25px] w-28" />
                <Skeleton className="h-[18.39px] w-8 rounded-2xl" />
              </div>
              <div className="space-y-0.5">
                <Skeleton className="h-[21px] w-full max-w-3/4" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-end gap-4 @2xl:col-span-2">
        <Skeleton className="bg-destructive h-9 w-[89px]" />
        <Skeleton className="bg-muted h-9 w-[68px] border" />
        <Skeleton className="bg-success h-9 w-32" />
      </div>
    </div>
  );
}
