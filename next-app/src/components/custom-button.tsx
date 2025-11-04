"use client";

import { BUTTON_EFFECT } from "@/constants/misc";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";
import Link from "next/link";
import React, { useEffect, useEffectEvent, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import {
  Button,
  ButtonIconProps,
  ButtonProps,
  buttonVariants,
} from "./ui/button";
import { Skeleton } from "./ui/skeleton";

interface Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  buttonLabel: string;
  linkHref?: string;
  hideLabelOnMobile?: boolean;
  target?: React.HTMLAttributeAnchorTarget;
  skeletonClassName?: React.HtmlHTMLAttributes<HTMLButtonElement>["className"];
}

const CustomButton = React.forwardRef<
  HTMLButtonElement,
  Props & ButtonIconProps
>(
  (
    {
      buttonLabel,
      linkHref,
      hideLabelOnMobile = true,
      target,
      skeletonClassName,
      ...restProps
    },
    ref,
  ) => {
    const matches = useMediaQuery("(min-width: 992px)");
    const [componentLoaded, setComponentLoaded] = useState(false);

    const componentMounted = useEffectEvent(() => setComponentLoaded(true));

    useEffect(() => {
      componentMounted();

      return () => setComponentLoaded(false);
    }, []);

    const spanClasses =
      !matches && restProps.icon && hideLabelOnMobile ? "hidden lg:inline" : "";

    if (!componentLoaded)
      return <ButtonSkeleton className={skeletonClassName} />;

    return (
      <Button
        ref={ref}
        size={
          !matches && restProps.icon && hideLabelOnMobile
            ? "icon"
            : restProps.size
        }
        {...restProps}
        className={cn("cursor-pointer gap-2", restProps.className)}
        effect={restProps.effect || BUTTON_EFFECT}
        asChild={!!linkHref}
      >
        {linkHref ? (
          <Link href={linkHref} target={target}>
            {restProps.size !== "icon" && (
              <span className={cn(spanClasses)}>{buttonLabel}</span>
            )}
          </Link>
        ) : (
          restProps.size !== "icon" && (
            <span className={cn(spanClasses)}>{buttonLabel}</span>
          )
        )}
      </Button>
    );
  },
);

CustomButton.displayName = "CustomButton";

export { CustomButton };

export function ButtonSkeleton({
  className,
}: (ButtonProps & ButtonIconProps) & React.RefAttributes<HTMLButtonElement>) {
  return (
    <Skeleton
      className={cn(
        "ring-offset-background focus-visible:ring-ring block h-10 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        className || "w-10",
      )}
    />
  );
}
