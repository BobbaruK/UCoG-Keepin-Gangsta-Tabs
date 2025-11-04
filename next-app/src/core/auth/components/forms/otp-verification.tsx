"use client";

import { CustomButton } from "@/components/custom-button";
import { CopyIcon } from "@/components/icons/copy";
import TextSeparator from "@/components/text-separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Skeleton } from "@/components/ui/skeleton";
import { MESSAGES } from "@/constants/messages";
import { DEFAULT_LOGIN_REDIRECT } from "@/constants/routes";
import { verifyTotp } from "@/core/auth/actions/verify-totp";
import { OTP } from "@/core/auth/schemas/otp";
import { cn } from "@/lib/utils";
import { formInputId } from "@/lib/utils/form-input-id";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import QRCode from "react-qr-code";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import z from "zod";

interface Props {
  otpLink: string;
  isFirstTime?: boolean;
  setOpenBackupCodesDialog?: (open: boolean) => void;
  setOpenScanQRCodeDialog?: (open: boolean) => void;
}

const OTPVerificationForm = ({
  otpLink,
  isFirstTime = false,
  setOpenBackupCodesDialog,
  setOpenScanQRCodeDialog,
}: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [copiedText, copy] = useCopyToClipboard();

  const form = useForm<z.infer<typeof OTP>>({
    resolver: zodResolver(OTP),
    defaultValues: {
      code: "",
      remember: false,
    },
  });

  const { formId, inputId } = formInputId("otp-verification-form");
  const url = otpLink ? new URL(otpLink) : "";
  const secret = url && url.searchParams.get("secret");

  const onSubmit = (values: z.infer<typeof OTP>) => {
    startTransition(async () => {
      verifyTotp(values, isFirstTime)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
            return;
          }

          if (data.success) toast.success(data.success);

          if (!isFirstTime) {
            router.push(DEFAULT_LOGIN_REDIRECT);
          } else {
            setOpenScanQRCodeDialog?.(false);
            setOpenBackupCodesDialog?.(true);
          }

          router.refresh();
        })
        .catch(() => {
          toast.error(MESSAGES.SOMETHING_WRONG);
        });
    });
  };

  const handleCopy = (text: string | null) => () => {
    if (!text) {
      toast.error("Nothing to copy");
      return;
    }

    copy(text)
      .then(() => {
        toast.success("Copied", {
          description: <div className="line-clamp-1">{copiedText || text}</div>,
        });
      })
      .catch((error) => {
        if (error instanceof Error) console.error(error.message);

        toast.error("Failed to copy!");
      });
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {otpLink && (
        <>
          <QRCode
            value={otpLink}
            className="h-auto w-full max-w-[300px] self-center border-8 border-white"
          />

          <TextSeparator label="OR" />

          <p>
            If you can&apos;t use the QR code, enter this secret key manually in
            your authenticator app.
          </p>

          <div className="grid grid-cols-[1fr_50px] items-center gap-2">
            <p className={cn("w-full truncate")}>{secret}</p>
            <CustomButton
              buttonLabel={`Copy secret`}
              variant={"secondary"}
              size={"icon"}
              icon={CopyIcon}
              iconPlacement="left"
              className="ms-auto size-10 min-w-10"
              skeletonClassName="ms-auto size-10 min-w-10"
              onClick={handleCopy(secret)}
            />
          </div>
        </>
      )}

      <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="code"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId(field.name)}>
                  One Time Password
                </FieldLabel>
                <InputOTP
                  id={inputId(field.name)}
                  {...field}
                  maxLength={6}
                  ref={inputRef}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} aria-invalid={fieldState.invalid} />
                    <InputOTPSlot index={1} aria-invalid={fieldState.invalid} />
                    <InputOTPSlot index={2} aria-invalid={fieldState.invalid} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} aria-invalid={fieldState.invalid} />
                    <InputOTPSlot index={4} aria-invalid={fieldState.invalid} />
                    <InputOTPSlot index={5} aria-invalid={fieldState.invalid} />
                  </InputOTPGroup>
                </InputOTP>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="remember"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                orientation={"horizontal"}
              >
                <Checkbox
                  id={inputId(field.name)}
                  name={field.name}
                  aria-invalid={fieldState.invalid}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldLabel
                  htmlFor={inputId(field.name)}
                  className="font-normal"
                >
                  Remember
                </FieldLabel>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <CustomButton
            buttonLabel={isFirstTime ? "Get the codes" : "Validate"}
            type="submit"
            className="w-full"
            disabled={isPending}
            skeletonClassName="w-full h-9"
          />
        </FieldGroup>
      </form>
    </div>
  );
};

export default OTPVerificationForm;

export function TwoFactorScanQRSkeleton({
  className,
  ...restProps
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-4", className)} {...restProps}>
      <Skeleton className="aspect-square w-full max-w-[300px] self-center" />

      <TextSeparator label="OR" />

      <div className="flex h-12 flex-col items-center justify-around gap-1">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
      </div>

      <div className="flex h-10 gap-3">
        <Skeleton className="h-full w-full" />
        <Skeleton className="h-full w-full max-w-10" />
      </div>

      <div className="flex flex-col gap-7">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-[19.25px] w-full" />
          <Skeleton className="h-9 w-full" />
        </div>

        <Skeleton className="h-[19.25px] w-full" />

        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
}
