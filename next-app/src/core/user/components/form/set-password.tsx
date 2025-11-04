import { CustomButton } from "@/components/custom-button";
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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransitionStartFunction } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { setPassword } from "../../actions/set-password";
import { NewPasswordSchema } from "../../schemas/new-password";
import {
  FieldSet,
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { formInputId } from "@/lib/utils/form-input-id";

interface Props extends React.FormHTMLAttributes<HTMLFormElement> {
  isLoading: boolean;
  startTransition: TransitionStartFunction;
  setOpenChangePasswordDialog: (open: boolean) => void;
}

const SetPasswordForm = ({
  isLoading,
  startTransition,
  setOpenChangePasswordDialog,
  ...restProps
}: Props) => {
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: process.env.NEXT_PUBLIC_DEFAULT_REGISTER_PASSWORD || "",
      confirmPassword: process.env.NEXT_PUBLIC_DEFAULT_REGISTER_PASSWORD || "",
    },
  });

  const { formId, inputId } = formInputId("set-password-form");

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    startTransition(async () => {
      await setPassword(values)
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
          setOpenChangePasswordDialog(false);
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
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId(field.name)}>Password</FieldLabel>
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
                  disabled={isLoading}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <CustomButton
            buttonLabel={`Set password`}
            type="submit"
            className="w-full"
            disabled={isLoading}
            skeletonClassName="w-full"
          />
        </FieldGroup>
      </FieldSet>
    </form>
  );
};

export default SetPasswordForm;

export function SetPasswordSkeleton({
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
      <div className="flex items-center justify-end gap-6">
        <Skeleton className="h-9 grow" />
      </div>
    </div>
  );
}
