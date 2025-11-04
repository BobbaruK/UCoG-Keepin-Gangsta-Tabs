"use client";

import { CustomAvatar } from "@/components/custom-avatar";
import { CustomButton } from "@/components/custom-button";
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
import { MESSAGES } from "@/constants/messages";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransitionStartFunction } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { changeAvatar } from "../../actions/change-avatar";
import { ChangeAvatarSchema } from "../../schemas/change-avatar";

interface Props extends React.FormHTMLAttributes<HTMLFormElement> {
  userImage: string | null;
  isLoading: boolean;
  startTransition: TransitionStartFunction;
  setOpenAvatarDialog: (open: boolean) => void;
}

const ChangeAvatarForm = ({
  userImage,
  isLoading,
  startTransition,
  setOpenAvatarDialog,
  ...restProps
}: Props) => {
  const form = useForm<z.infer<typeof ChangeAvatarSchema>>({
    resolver: zodResolver(ChangeAvatarSchema),
    defaultValues: {
      url: userImage || "",
    },
  });
  const { refetch } = useSession();

  const handleUpdateAvatar = (values: z.infer<typeof ChangeAvatarSchema>) =>
    startTransition(async () =>
      changeAvatar(values)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
            return;
          }

          if (data.success) {
            toast.success(data.success);
          }

          setOpenAvatarDialog(false);
          refetch();
        })
        .catch(() => {
          toast.error(MESSAGES.SOMETHING_WRONG);
          setOpenAvatarDialog(false);
        }),
    );

  useWatch({
    name: "url",
    control: form.control,
  });

  return (
    <>
      <div className={cn("flex items-center gap-4", restProps.className)}>
        <CustomAvatar image={form.getValues("url")} className="size-24" />
        <CustomButton
          buttonLabel="Remove"
          onClick={() => form.setValue("url", "")}
          disabled={isLoading}
          skeletonClassName="w-[83px]"
        />
      </div>
      <Form {...form} {...restProps}>
        <form
          onSubmit={form.handleSubmit(handleUpdateAvatar)}
          className={cn(restProps.className, "space-y-6")}
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="URL to image"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>Preferable 94x94 picture</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
              onClick={() => setOpenAvatarDialog(false)}
            />
          </div>
        </form>
      </Form>
    </>
  );
};

export default ChangeAvatarForm;
