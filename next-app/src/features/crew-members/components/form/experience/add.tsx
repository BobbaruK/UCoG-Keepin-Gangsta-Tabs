"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import Counter from "@/components/counter";
import { CustomButton } from "@/components/custom-button";
import { TrashIcon } from "@/components/icons/trash";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { MESSAGES } from "@/constants/messages";
import { crewLevelsTitle } from "@/constants/page-title/crew-levels";
import { crewMembersTitle } from "@/constants/page-title/crew-members";
import { playthroughTitle } from "@/constants/page-title/playtrough";
import { addExperiences } from "@/features/crew-members/actions/experience/add";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { formInputId } from "@/lib/utils/form-input-id";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { experienceSchema } from "../../../schemas/experience";
import { CrewLevel } from "../../../types/level";
import Levels from "../experience/levels";

interface Props {
  playthroughId: string;
  memberId: string;
  levels: CrewLevel[] | undefined;
}

const AddExperienceForm = ({ playthroughId, memberId, levels }: Props) => {
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

  const crewMembersPath = `${playthroughTitle.href}/${playthroughId + crewMembersTitle.href}`;

  function onSubmit(values: z.infer<typeof experienceSchema>) {
    startTransition(async () => {
      addExperiences({ values, memberId })
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
        <FieldLegend variant="label">Experience</FieldLegend>
        <FieldDescription>Add experience</FieldDescription>
        <FieldGroup className="gap-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-col gap-4">
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
                size={"sm"}
                className="ms-auto"
                onClick={() => remove(index)}
              />
              <Separator />
            </div>
          ))}

          <CustomButton
            buttonLabel="Add experience"
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                memberId,
                levelId: "",
                value: 1,
              })
            }
          />
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
        />
        <CustomButton
          buttonLabel="Save experience"
          type="submit"
          form={formId}
          disabled={isPending || !form.getValues("experiences").length}
        />
        <CustomButton buttonLabel="Skip" linkHref={crewMembersPath} />
      </div>
    </form>
  );
};

export default AddExperienceForm;
