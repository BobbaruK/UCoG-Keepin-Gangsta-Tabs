"use client";

import { CustomButton } from "@/components/custom-button";
import { EnvelopeIcon } from "@/components/icons/envelope";
import ResponsiveDialog from "@/components/responsive-dialog";
import { MagicLinkFormSkeleton } from "@/core/auth/components/forms/magic-link";
import { lazy, Suspense, useState } from "react";
const MagicLinkForm = lazy(
  () => import("@/core/auth/components/forms/magic-link"),
);

const SignInMagicLink = () => {
  const [open, setOpen] = useState(false);

  return (
    <ResponsiveDialog
      open={open}
      setOpen={setOpen}
      trigger={{
        element: (
          <CustomButton
            buttonLabel="Magic link"
            iconPlacement="left"
            icon={EnvelopeIcon}
            hideLabelOnMobile={false}
            variant={"outline"}
            className="w-full"
            skeletonClassName="w-full h-9"
            onClick={() => setOpen(!open)}
          />
        ),
        type: "element",
      }}
      header={{
        title: {
          label: "Enter your email address",
        },
        description:
          "We will send you a link by mail that will sign you in instantly!",
      }}
    >
      <Suspense fallback={<MagicLinkFormSkeleton />}>
        <MagicLinkForm setOpen={setOpen} />
      </Suspense>
    </ResponsiveDialog>
  );
};

export default SignInMagicLink;
