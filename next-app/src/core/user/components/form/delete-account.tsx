"use client";

import { CustomButton } from "@/components/custom-button";
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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode, TransitionStartFunction } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { deleteUser } from "../../actions/delete-user";
import { DeleteAccountSchema } from "../../schemas/delete-account";
import { formInputId } from "@/lib/utils/form-input-id";
import {
  FieldSet,
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";

interface Props extends React.FormHTMLAttributes<HTMLFormElement> {
  userEmail: string;
  isPending: boolean;
  startTransition: TransitionStartFunction;
  setOpenDeleteAccountDialog: (open: boolean) => void;
  closeDialog?: ReactNode;
}

const DeleteAccountForm = ({
  userEmail,
  isPending,
  startTransition,
  setOpenDeleteAccountDialog,
  closeDialog,
  ...restProps
}: Props) => {
  const form = useForm<z.infer<typeof DeleteAccountSchema>>({
    resolver: zodResolver(DeleteAccountSchema),
    defaultValues: {
      email: "",
    },
  });

  const { formId, inputId } = formInputId("delete-account-form");

  const onSubmit = (values: z.infer<typeof DeleteAccountSchema>) => {
    startTransition(async () => {
      deleteUser(values, userEmail)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
            return;
          }

          if (data.success) {
            toast.success(data.success);
            setOpenDeleteAccountDialog(false);
          }
        })
        .catch(() => {
          toast.error(MESSAGES.SOMETHING_WRONG);
        });
    });
  };

  return (
    <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
      <FieldSet>
        <FieldGroup>
          <Controller
            name="email"
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
                  disabled={isPending}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="flex items-center gap-x-6 gap-y-2 max-sm:flex-wrap">
            <CustomButton
              buttonLabel={`Send verification email`}
              type="submit"
              className="w-full"
              variant={"danger"}
              disabled={isPending}
              skeletonClassName="w-full"
            />
            {closeDialog}
          </div>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};

export default DeleteAccountForm;

export function DeleteAccountSkeleton({
  className,
  ...restProps
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-7", className)} {...restProps}>
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
