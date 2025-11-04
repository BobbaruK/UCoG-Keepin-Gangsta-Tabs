"use client";

import { CustomButton } from "@/components/custom-button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MESSAGES } from "@/constants/messages";
import { updateUser } from "@/core/user/actions/update-user";
import { PersonalSchema } from "@/core/user/schemas/personal";
import { useSettingsContext } from "@/features/settings/providers/settings";
import { useSession } from "@/lib/auth-client";
import { formInputId } from "@/lib/utils/form-input-id";
import { createFormattedSlug } from "@/lib/utils/format-string";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export const PersonalForm = () => {
  const { user, isLoading, startTransition } = useSettingsContext();
  const form = useForm<z.infer<typeof PersonalSchema>>({
    resolver: zodResolver(PersonalSchema),
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      username: user?.displayUsername || undefined,
      slug: user.slug,
      bio: user?.bio || undefined,
    },
  });
  const { refetch } = useSession();

  const { formId, inputId } = formInputId("personal-form");

  const onSubmit = (values: z.infer<typeof PersonalSchema>) => {
    startTransition(async () => {
      updateUser(values, user)
        .then((data) => {
          if (data.username_error) {
            form.setError("username", {
              message: MESSAGES.USERNAME_NOT_AVAILABLE,
            });
          }

          if (data.error) {
            toast.error(data.error);
          }

          if (data.success) {
            toast.success(data.success);
          }

          refetch();
        })
        .catch(() => {
          toast.error(MESSAGES.SOMETHING_WRONG);
        });
    });
  };

  return (
    <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
      <FieldSet>
        <FieldGroup className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Controller
            name="firstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId(field.name)}>
                  First Name
                </FieldLabel>
                <Input
                  {...field}
                  id={inputId(field.name)}
                  aria-invalid={fieldState.invalid}
                  placeholder="John"
                  autoComplete="off"
                  type="text"
                  disabled={isLoading}
                  onKeyUp={() => {
                    form.setValue(
                      "slug",
                      createFormattedSlug(
                        field.value,
                        form.getValues("lastName"),
                        form.getValues("username"),
                      ),
                    );
                  }}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="lastName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId(field.name)}>
                  First Name
                </FieldLabel>
                <Input
                  {...field}
                  id={inputId(field.name)}
                  aria-invalid={fieldState.invalid}
                  placeholder="Doe"
                  autoComplete="off"
                  type="text"
                  disabled={isLoading}
                  onKeyUp={() => {
                    form.setValue(
                      "slug",
                      createFormattedSlug(
                        form.getValues("firstName"),
                        field.value,
                        form.getValues("username"),
                      ),
                    );
                  }}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId(field.name)}>Username</FieldLabel>
                <Input
                  {...field}
                  id={inputId(field.name)}
                  aria-invalid={fieldState.invalid}
                  placeholder="Doughnut"
                  autoComplete="off"
                  type="text"
                  disabled={isLoading}
                  onKeyUp={() => {
                    form.setValue(
                      "slug",
                      createFormattedSlug(
                        form.getValues("firstName"),
                        form.getValues("lastName"),
                        field.value,
                      ),
                    );
                  }}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="slug"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId(field.name)}>Slug</FieldLabel>
                <Input
                  {...field}
                  id={inputId(field.name)}
                  aria-invalid={fieldState.invalid}
                  placeholder="doe-john-doughnut"
                  autoComplete="off"
                  type="text"
                  disabled={true}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="bio"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="md:col-span-2"
              >
                <FieldLabel htmlFor={inputId(field.name)}>Bio</FieldLabel>
                <Textarea
                  {...field}
                  aria-invalid={fieldState.invalid}
                  id={inputId(field.name)}
                  placeholder="Tell us a little bit about yourself"
                  rows={4}
                  disabled={isLoading}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <div className="flex">
          <CustomButton
            buttonLabel={`Update`}
            type="submit"
            disabled={isLoading}
            className="ms-auto"
            skeletonClassName="w-full h-9"
          />
        </div>
      </FieldSet>
    </form>
  );
};
