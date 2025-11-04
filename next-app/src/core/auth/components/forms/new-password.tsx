"use client";

import { CustomButton } from "@/components/custom-button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { MESSAGES } from "@/constants/messages";
import { newPassword } from "@/core/auth/actions/new-password";
import { NewPasswordSchema } from "@/core/user/schemas/new-password";
import { formInputId } from "@/lib/utils/form-input-id";
import { ErrorCode } from "@/types/errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface Props {
  token: string;
  error: ErrorCode;
}

export const NewPasswordForm = ({ token, error }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: process.env.NEXT_PUBLIC_DEFAULT_REGISTER_PASSWORD || "",
      confirmPassword: process.env.NEXT_PUBLIC_DEFAULT_REGISTER_PASSWORD || "",
    },
  });

  const { formId, inputId } = formInputId("new-password-form");

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    startTransition(() => {
      newPassword(values, token)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          }

          if (data.success) {
            toast.success(data.success);
            router.push("/login");
          }
        })
        .catch(() => {
          toast.error(MESSAGES.SOMETHING_WRONG);
        });
    });
  };

  useEffect(() => {
    const timeOut = setTimeout(() => {
      switch (error) {
        case "INVALID_TOKEN":
          toast.error(MESSAGES.TOKEN_INVALID);
          break;
      }
    }, 200);

    return () => {
      clearTimeout(timeOut);
    };
  }, [error]);

  return (
    <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={inputId(field.name)}>
                New password
              </FieldLabel>
              <PasswordInput
                {...field}
                id={inputId(field.name)}
                aria-invalid={fieldState.invalid}
                placeholder="********"
                autoComplete="off"
                disabled={isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={inputId(field.name)}>
                Confirm password
              </FieldLabel>
              <PasswordInput
                {...field}
                id={inputId(field.name)}
                aria-invalid={fieldState.invalid}
                placeholder="********"
                autoComplete="off"
                disabled={isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <CustomButton
          buttonLabel={`Set password`}
          type="submit"
          className="w-full"
          disabled={isPending}
          skeletonClassName="w-full"
        />
      </FieldGroup>
    </form>
  );
};
