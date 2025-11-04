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
import { PasswordInput } from "@/components/ui/password-input";
import { Skeleton } from "@/components/ui/skeleton";
import { MESSAGES } from "@/constants/messages";
import { ChangePasswordSchema } from "@/core/auth/schemas/change-password";
import { changePassword } from "@/core/user/actions/change-password";
import { cn } from "@/lib/utils";
import { formInputId } from "@/lib/utils/form-input-id";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransitionStartFunction } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface Props extends React.FormHTMLAttributes<HTMLFormElement> {
  isLoading: boolean;
  startTransition: TransitionStartFunction;
  setOpenChangePasswordDialog: (open: boolean) => void;
}

const ChangePasswordForm = ({
  isLoading,
  startTransition,
  setOpenChangePasswordDialog,
  ...restProps
}: Props) => {
  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: process.env.NEXT_PUBLIC_DEFAULT_REGISTER_PASSWORD || "",
      newPassword: process.env.NEXT_PUBLIC_DEFAULT_REGISTER_PASSWORD || "",
      confirmNewPassword:
        process.env.NEXT_PUBLIC_DEFAULT_REGISTER_PASSWORD || "",
    },
  });

  const { formId, inputId } = formInputId("change-password-form");

  const onSubmit = (values: z.infer<typeof ChangePasswordSchema>) => {
    startTransition(async () => {
      await changePassword(values)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);
          }
        })
        .catch(() => {
          toast.error(MESSAGES.SOMETHING_WRONG);
        })
        .finally(() => {
          setOpenChangePasswordDialog(false);
        });
    });
  };

  return (
    <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
      <FieldSet>
        <FieldGroup>
          <Controller
            name="currentPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId(field.name)}>
                  Current password
                </FieldLabel>
                <PasswordInput
                  {...field}
                  id={inputId(field.name)}
                  aria-invalid={fieldState.invalid}
                  placeholder="********"
                  autoComplete="off"
                  disabled={isLoading}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="newPassword"
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
                  disabled={isLoading}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="confirmNewPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId(field.name)}>
                  Confirm new password
                </FieldLabel>
                <PasswordInput
                  {...field}
                  id={inputId(field.name)}
                  aria-invalid={fieldState.invalid}
                  placeholder="********"
                  autoComplete="off"
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
              buttonLabel={`Change password`}
              type="submit"
              className="w-full"
              disabled={isLoading}
              skeletonClassName="w-full"
            />
          </div>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};

export default ChangePasswordForm;

export function ChangePasswordSkeleton({
  className,
  ...restProps
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-7", className)} {...restProps}>
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
      <div className="flex items-center justify-end gap-6">
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
}
