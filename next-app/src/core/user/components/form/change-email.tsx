"use client";

import { CustomButton } from "@/components/custom-button";
import {
  FieldSet,
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { MESSAGES } from "@/constants/messages";
import { ChangeEmailSchema } from "@/core/auth/schemas/change-email";
import { changeEmail } from "@/core/user/actions/change-email";
import { cn } from "@/lib/utils";
import { formInputId } from "@/lib/utils/form-input-id";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransitionStartFunction } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface Props extends React.FormHTMLAttributes<HTMLFormElement> {
  userEmail: string;
  isLoading: boolean;
  startTransition: TransitionStartFunction;
  setOpenChangeEmailDialog: (open: boolean) => void;
}

const ChangeEmailForm = ({
  userEmail,
  isLoading,
  startTransition,
  setOpenChangeEmailDialog,
  ...restProps
}: Props) => {
  const form = useForm<z.infer<typeof ChangeEmailSchema>>({
    resolver: zodResolver(ChangeEmailSchema),
    defaultValues: {
      oldEmail: "",
      newEmail: "",
    },
  });

  const { formId, inputId } = formInputId("change-email-form");

  const onSubmit = (values: z.infer<typeof ChangeEmailSchema>) => {
    startTransition(async () => {
      changeEmail(values, userEmail)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
            return;
          }

          if (data.success) {
            toast.success(data.success);
          }

          setOpenChangeEmailDialog(false);
        })
        .catch(() => {
          toast.error(MESSAGES.SOMETHING_WRONG);
          setOpenChangeEmailDialog(false);
        });
    });
  };

  return (
    <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
      <FieldSet>
        <FieldGroup>
          <Controller
            name="oldEmail"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId(field.name)}>Email</FieldLabel>
                <Input
                  {...field}
                  id={inputId(field.name)}
                  aria-invalid={fieldState.invalid}
                  placeholder="jon.doe@example.com"
                  autoComplete="off"
                  type="text"
                  disabled={isLoading}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="newEmail"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId(field.name)}>New email</FieldLabel>
                <Input
                  {...field}
                  id={inputId(field.name)}
                  aria-invalid={fieldState.invalid}
                  placeholder="jon.doe@example.com"
                  autoComplete="off"
                  type="text"
                  disabled={isLoading}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="flex flex-wrap items-center gap-6">
            <CustomButton
              buttonLabel={`Confirm`}
              type="submit"
              className="grow"
              disabled={isLoading}
              skeletonClassName="grow"
            />
            <CustomButton
              buttonLabel={`Cancel`}
              type="button"
              className="grow"
              variant={"outline"}
              disabled={isLoading}
              skeletonClassName="grow"
              onClick={() => setOpenChangeEmailDialog(false)}
            />
          </div>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};

export default ChangeEmailForm;

export function ChangeEmailSkeleton({
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
      <div className="flex items-center justify-end gap-6">
        <Skeleton className="h-9 grow" />
        <Skeleton className="h-9 grow" />
      </div>
    </div>
  );
}
