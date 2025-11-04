"use client";

import { CustomButton } from "@/components/custom-button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
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
import { MESSAGES } from "@/constants/messages";
import { DEFAULT_LOGIN_REDIRECT } from "@/constants/routes";
import { verifyBackupCodes } from "@/core/auth/actions/verify-backup-codes";
import { RecoverAccountSchema } from "@/core/auth/schemas/recover-account";
import { formInputId } from "@/lib/utils/form-input-id";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export const RecoverAccountForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RecoverAccountSchema>>({
    resolver: zodResolver(RecoverAccountSchema),
    defaultValues: {
      code: "",
      remember: false,
    },
  });

  const { formId, inputId } = formInputId("recover-account-form");

  const onSubmit = (values: z.infer<typeof RecoverAccountSchema>) => {
    startTransition(() => {
      verifyBackupCodes(values)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);
            router.push(DEFAULT_LOGIN_REDIRECT);
          }
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
          name="code"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={inputId(field.name)}>
                Recovery code
              </FieldLabel>
              <Input
                {...field}
                id={inputId(field.name)}
                aria-invalid={fieldState.invalid}
                placeholder="Abc12-34dEf"
                autoComplete="off"
                type="text"
                disabled={isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="remember"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} orientation={"horizontal"}>
              <Checkbox
                id={inputId(field.name)}
                name={field.name}
                aria-invalid={fieldState.invalid}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <FieldLabel htmlFor={inputId(field.name)} className="font-normal">
                Remember
              </FieldLabel>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <CustomButton
          buttonLabel={`Recover account`}
          type="submit"
          className="w-full"
          disabled={isPending}
          skeletonClassName="w-full"
        />
      </FieldGroup>
    </form>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recovery code</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Asd-123"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="remember"
            render={({ field }) => {
              return (
                <FormItem className="flex flex-row items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      className="cursor-pointer"
                      onCheckedChange={(checked) => {
                        form.setValue("remember", !!checked);
                      }}
                    />
                  </FormControl>
                  <FormLabel className="cursor-pointer text-sm font-normal">
                    Remember this device.
                  </FormLabel>
                </FormItem>
              );
            }}
          />
        </div>

        <CustomButton
          buttonLabel={`Recover account`}
          type="submit"
          className="w-full"
          disabled={isPending}
          skeletonClassName="w-full"
        />
      </form>
    </Form>
  );
};
