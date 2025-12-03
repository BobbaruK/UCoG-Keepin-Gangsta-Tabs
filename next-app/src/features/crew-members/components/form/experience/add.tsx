"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import Counter from "@/components/counter";
import { CustomButton } from "@/components/custom-button";
import { TrashIcon } from "@/components/icons/trash";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { MESSAGES } from "@/constants/messages";
import { crewLevelsTitle } from "@/constants/page-title/crew-levels";
import { crewMembersTitle } from "@/constants/page-title/crew-members";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { CrewLevel } from "@/core/cog/crew-level/types/crew-level";
import { Playthrough } from "@/core/cog/playthrough/types/playthrough";
import { addExperiences } from "@/features/crew-members/actions/experience/add";
import { cn } from "@/lib/utils";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { formInputId } from "@/lib/utils/form-input-id";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { experienceSchema } from "../../../schemas/experience";
import Levels from "../experience/levels";

interface Props {
  playthrough: Playthrough;
  memberId: string;
  levels: CrewLevel[] | undefined;
}

const AddExperienceForm = ({ playthrough, memberId, levels }: Props) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof experienceSchema>>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      experiences: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "experiences",
  });

  const { formId, inputId } = formInputId("edit-experience");

  const crewMembersPath = `${playthroughTitle.href}/${playthrough.id + crewMembersTitle.href}`;

  function onSubmit(values: z.infer<typeof experienceSchema>) {
    startTransition(async () => {
      addExperiences({ values, playthrough })
        .then(async (data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);
            // memberCreated(data.crewMemberId);
            router.push(crewMembersPath);
          }
        })
        .catch(() => {
          toast.error(MESSAGES.SOMETHING_WRONG);
        });
    });
  }

  // levels?.find((level, index) => level.id === fields[index].levelId)?.max_level;

  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <FieldSet className="gap-4">
        {/* <FieldLegend variant="label">Experience</FieldLegend>
        <FieldDescription>Add experience</FieldDescription> */}
        <FieldGroup className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4">
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  {/* <Controller
                    name={`experiences.${index}.memberId`}
                    control={form.control}
                    render={({ field: controllerField, fieldState }) => (
                      <Field
                        orientation="horizontal"
                        data-invalid={fieldState.invalid}
                      >
                        <FieldContent>
                          <InputGroup>
                            <InputGroupInput
                              {...controllerField}
                              id={`form-rhf-array-email-${index}`}
                              aria-invalid={fieldState.invalid}
                              placeholder="name@example.com"
                              type="text"
                            />
                            {fields.length > 1 && (
                              <InputGroupAddon align="inline-end">
                                <InputGroupButton
                                  type="button"
                                  variant="ghost"
                                  size="icon-xs"
                                  onClick={() => remove(index)}
                                  aria-label={`Remove email ${index + 1}`}
                                >
                                  <XIcon />
                                </InputGroupButton>
                              </InputGroupAddon>
                            )}
                          </InputGroup>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </FieldContent>
                      </Field>
                    )}
                  /> */}

                  <Controller
                    name={`experiences.${index}.levelId`}
                    control={form.control}
                    render={({ field: controllerField, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={inputId(controllerField.name)}>
                          {capitalizeFirstLetter(
                            crewLevelsTitle.label.singular.toLowerCase(),
                          )}
                        </FieldLabel>

                        <Levels
                          memberId={memberId}
                          levels={levels}
                          controllerField={controllerField}
                          fieldState={fieldState}
                          getValues={form.getValues}
                          setValue={form.setValue}
                          index={index}
                          updateExperience={(index, obj) => update(index, obj)}
                          fields={fields}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name={`experiences.${index}.value`}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={inputId(field.name)}>
                          Recruited turn
                        </FieldLabel>

                        <div className="flex items-center gap-2">
                          <Input
                            {...field}
                            id={inputId(field.name)}
                            aria-invalid={fieldState.invalid}
                            placeholder="12"
                            autoComplete="off"
                            type="number"
                            disabled={true}
                            className={"opacity-100!"}
                            {...form.register(`experiences.${index}.value`, {
                              valueAsNumber: true,
                            })}
                          />
                          <Counter
                            value={field.value}
                            emitClick={(val) =>
                              form.setValue(`experiences.${index}.value`, val)
                            }
                            isPending={isPending}
                            minValue={1}
                            maxValue={
                              levels?.find(
                                (level) => level.id === fields[index].levelId,
                              )?.max_level
                            }
                          />
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                <CustomButton
                  type="button"
                  buttonLabel="Remove"
                  icon={TrashIcon}
                  iconPlacement="left"
                  variant={"destructive"}
                  hideLabelOnMobile={false}
                  size={"sm"}
                  className="ms-auto"
                  onClick={() => remove(index)}
                />
              </CardContent>
            </Card>
          ))}

          <CustomButton
            buttonLabel="Add experience"
            type="button"
            variant="outline"
            // size="sm"
            className="h-auto w-auto rounded-xl shadow-sm"
            onClick={() =>
              append({
                memberId,
                levelId: "",
                value: 1,
              })
            }
          />
          {/* </div> */}
        </FieldGroup>

        {form.formState.errors.experiences?.root && (
          <FieldError errors={[form.formState.errors.experiences.root]} />
        )}
      </FieldSet>

      <div className="flex items-center gap-4">
        <CustomButton
          buttonLabel="Reset"
          variant={"outline"}
          type="button"
          onClick={() => form.reset()}
          disabled={isPending || !form.getValues("experiences").length}
          className="ms-auto"
        />
        <CustomButton
          buttonLabel="Skip"
          linkHref={crewMembersPath}
          variant={"outline"}
        />
        <CustomButton
          buttonLabel="Save experience"
          type="submit"
          form={formId}
          disabled={isPending}
          variant={"success"}
        />
      </div>
    </form>
  );
};

export default AddExperienceForm;

export function AddExperienceFormSkeleton({
  className,
  ...restProps
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...restProps}>
      <div className="flex flex-col justify-end gap-3">
        <Skeleton className="h-[38px] w-full rounded-xl" />
      </div>
      <div className="flex flex-wrap items-center justify-end gap-4">
        <Skeleton className="bg-muted h-9 w-[69px] border" />
        <Skeleton className="bg-muted h-9 w-[68px] border" />
        <Skeleton className="bg-success h-9 w-[134px]" />
      </div>
    </div>
  );
}
