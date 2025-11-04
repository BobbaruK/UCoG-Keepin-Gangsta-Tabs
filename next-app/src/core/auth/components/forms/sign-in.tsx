"use client";

import { CustomButton } from "@/components/custom-button";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { MESSAGES } from "@/constants/messages";
import { DEFAULT_LOGIN_REDIRECT } from "@/constants/routes";
import { signIn } from "@/core/auth/actions/sign-in";
import { LoginSchema } from "@/core/auth/schemas/login";
import { useSession } from "@/lib/auth-client";
import { formInputId } from "@/lib/utils/form-input-id";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export const SignInForm = () => {
  const router = useRouter();
  const { refetch } = useSession();
  const [isPending, startTransition] = useTransition();

  const { formId, inputId } = formInputId("login-form");

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: process.env.NEXT_PUBLIC_DEFAULT_REGISTER_PASSWORD || "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    startTransition(async () => {
      signIn(values)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          }

          if (data.redirectOTP) {
            toast.success(MESSAGES.ENTER_OTP);
            router.push("/two-factor-verification");
            return;
          }

          if (data.success) {
            toast.success(MESSAGES.LOGIN_SUCCESS);
            router.push(DEFAULT_LOGIN_REDIRECT);
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
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={inputId(field.name)}>
                Username or Email
              </FieldLabel>
              <Input
                {...field}
                id={inputId(field.name)}
                aria-invalid={fieldState.invalid}
                placeholder="jon.doe@example.com"
                autoComplete="off"
                type="text"
                disabled={isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex flex-wrap items-center gap-4">
                <FieldLabel htmlFor={inputId(field.name)}>Password</FieldLabel>
                <Button
                  size={"sm"}
                  variant={"link"}
                  asChild
                  className="text-foreground ms-auto h-auto px-0 font-normal"
                >
                  <Link href={"/forgot-password"}>Forgot password?</Link>
                </Button>
              </div>
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
          buttonLabel={`Login`}
          type="submit"
          className="w-full"
          disabled={isPending}
          skeletonClassName="w-full h-9"
          // form="login-form"
        />
      </FieldGroup>
    </form>
  );
};
