"use client";

import { CustomButton } from "@/components/custom-button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { Skeleton } from "@/components/ui/skeleton";
import { MESSAGES } from "@/constants/messages";
import { disable2fa, enable2fa } from "@/core/auth/actions/handle-2fa";
import { Handle2faSchema } from "@/core/auth/schemas/handle-2fa";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { formInputId } from "@/lib/utils/form-input-id";
import { UserProfile } from "@/types/user-profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransitionStartFunction } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface Props extends React.FormHTMLAttributes<HTMLFormElement> {
  user: UserProfile;
  isLoading: boolean;
  startTransition: TransitionStartFunction;
  setTotpURI: (uri: string) => void;
  setOpenActivate2faDialog: (open: boolean) => void;
  setBackupCodes: (codes: string[]) => void;
  setOpenScanQRCodeDialog: (open: boolean) => void;
}

const ActivationTwoFactorForm = ({
  user,
  isLoading,
  startTransition,
  setTotpURI,
  setOpenActivate2faDialog,
  setBackupCodes,
  setOpenScanQRCodeDialog,
  ...restProps
}: Props) => {
  const { refetch } = useSession();
  const form = useForm<z.infer<typeof Handle2faSchema>>({
    resolver: zodResolver(Handle2faSchema),
    defaultValues: {
      password: process.env.NEXT_PUBLIC_DEFAULT_REGISTER_PASSWORD || "",
    },
  });

  const { formId, inputId } = formInputId("activate-2fa-form");

  const onSubmit = (values: z.infer<typeof Handle2faSchema>) => {
    startTransition(async () => {
      if (!user.twoFactorEnabled) {
        enable2fa(values)
          .then(async (data) => {
            if (data.error) {
              toast.error(data.error);
            }

            if (data.success) {
              toast.success(data.success);

              setOpenActivate2faDialog(false);
              setTotpURI(data.totpURI);
              setBackupCodes(data.backupCodes);
              setOpenScanQRCodeDialog(true);

              refetch();
            }
          })
          .catch(() => {
            toast.error(MESSAGES.SOMETHING_WRONG);
          });

        return;
      }

      disable2fa(values)
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
          setOpenActivate2faDialog(false);
          setTotpURI("");
          setBackupCodes([]);

          refetch();
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

          <CustomButton
            buttonLabel={user.twoFactorEnabled ? "Disable" : "Enable"}
            type="submit"
            className="grow"
            variant={user.twoFactorEnabled ? "warning" : "success"}
            disabled={isLoading}
            skeletonClassName="grow"
          />
        </FieldGroup>
      </FieldSet>
    </form>
  );
};

export default ActivationTwoFactorForm;

export function ActivateTwoFASkeleton({
  className,
  ...restProps
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-7", className)} {...restProps}>
      <div className="flex flex-col justify-end gap-3">
        <Skeleton className="h-[19.25px] w-28" />
        <Skeleton className="h-9 w-full" />
      </div>
      <Skeleton className="h-9 w-full" />
    </div>
  );
}
