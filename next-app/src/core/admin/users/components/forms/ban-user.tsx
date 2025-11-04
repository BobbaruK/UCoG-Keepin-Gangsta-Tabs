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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { BATCH_ITEMS } from "@/constants/misc";
import { banUser } from "@/core/admin/users/actions/ban-user";
import { BanUserSchema } from "@/core/admin/users/schemas/ban-user";
import { cn } from "@/lib/utils";
import { chunkArray } from "@/lib/utils/chunk-array";
import { formInputId } from "@/lib/utils/form-input-id";
import { UserSession } from "@/types/session";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransitionStartFunction } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface Props extends React.FormHTMLAttributes<HTMLFormElement> {
  users: UserSession[];
  isLoading: boolean;
  startTransition: TransitionStartFunction;
  setOpenBanDialog?: (open: boolean) => void;
}

const BanUserForm = ({
  users,
  isLoading,
  startTransition,
  setOpenBanDialog,
  ...restProps
}: Props) => {
  const form = useForm<z.infer<typeof BanUserSchema>>({
    resolver: zodResolver(BanUserSchema),
    defaultValues: {
      banReason: "",
      banExpiresIn: 0,
    },
  });

  const userIdBatches = chunkArray(users, BATCH_ITEMS);
  const { formId, inputId } = formInputId("ban-user-form");

  const onSubmit = (values: z.infer<typeof BanUserSchema>) => {
    setOpenBanDialog?.(false);

    startTransition(async () => {
      for (const batch of userIdBatches) {
        const results = (await Promise.allSettled(
          batch.map((user) =>
            banUser({
              user,
              banReason: values.banReason,
              banExpiresIn: values.banExpiresIn,
            }),
          ),
        )) as {
          status: string;
          value: {
            error?: string;
            success?: string;
          };
        }[];

        for (const result of results) {
          if (result.value.error) toast.error(result.value.error);
          if (result.value.success) toast.success(result.value.success);
        }

        await new Promise((r) => setTimeout(r, 200));
      }
    });
  };

  return (
    <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
      <FieldSet>
        <FieldGroup>
          <Controller
            name="banReason"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId(field.name)}>
                  Ban reason
                </FieldLabel>
                <Input
                  {...field}
                  id={inputId(field.name)}
                  aria-invalid={fieldState.invalid}
                  placeholder="Spam"
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
            name="banExpiresIn"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId(field.name)}>
                  Ban reason
                </FieldLabel>
                <Input
                  {...field}
                  id={inputId(field.name)}
                  aria-invalid={fieldState.invalid}
                  type="number"
                  placeholder="3600"
                  autoComplete="off"
                  disabled={isLoading}
                  {...form.register("banExpiresIn", { valueAsNumber: true })}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <CustomButton
            buttonLabel={`Confirm`}
            type="submit"
            className="w-full"
            disabled={isLoading}
            skeletonClassName="h-9 w-full"
          />
        </FieldGroup>
      </FieldSet>
    </form>
  );
};

export default BanUserForm;

export function BanUserFormSkeleton({
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
      <Skeleton className="h-9 w-full" />
    </div>
  );
}
