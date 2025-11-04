import { CustomButton } from "@/components/custom-button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { MESSAGES } from "@/constants/messages";
import { signInMagicLink } from "@/core/auth/actions/sign-in";
import { MagicLinkSchema } from "@/core/auth/schemas/magic-link";
import { cn } from "@/lib/utils";
import { formInputId } from "@/lib/utils/form-input-id";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface Props extends React.FormHTMLAttributes<HTMLFormElement> {
  setOpen: (open: boolean) => void;
}

const MagicLinkForm = ({ setOpen, ...restProps }: Props) => {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof MagicLinkSchema>>({
    resolver: zodResolver(MagicLinkSchema),
    defaultValues: {
      email: "",
    },
  });

  const { formId, inputId } = formInputId("magic-link-form");

  const onSubmit = (values: z.infer<typeof MagicLinkSchema>) => {
    startTransition(async () => {
      signInMagicLink(values)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          }

          if (data.success) {
            toast.success(data.success);
            setOpen(false);
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

          <CustomButton
            buttonLabel={`Send magic link`}
            type="submit"
            className="ms-auto"
            disabled={isPending}
            skeletonClassName="w-[90px] h-9"
          />
        </FieldGroup>
      </FieldSet>
    </form>
  );
};

export default MagicLinkForm;

export function MagicLinkFormSkeleton({
  className,
  ...restProps
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-7", className)} {...restProps}>
      <div className="flex flex-col items-start justify-end gap-3">
        <Skeleton className="h-[19.25px] w-10" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="flex items-center justify-end gap-6">
        <Skeleton className="h-9 w-[133px]" />
      </div>
    </div>
  );
}
