"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useCustomMediaQuery } from "@/hooks/use-media-query";
import { Header, Trigger } from "@/types/responsive-dialog";
import { ReactNode, useEffect, useEffectEvent, useState } from "react";
import { CustomButton } from "./custom-button";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  trigger: Trigger;
  header: Header;
  children: ReactNode;
}

function ResponsiveDialog({ open, setOpen, trigger, header, children }: Props) {
  const isDesktop = useCustomMediaQuery();
  const [componentLoaded, setComponentLoaded] = useState(false);

  const componentMounted = useEffectEvent(() => setComponentLoaded(true));

  useEffect(() => {
    componentMounted();

    return () => setComponentLoaded(false);
  }, []);

  if (!componentLoaded && trigger.hidden) return null;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        {trigger.type === "label" && (
          <DialogTrigger asChild hidden={trigger.hidden}>
            <CustomButton buttonLabel={trigger.label} variant="outline" />
          </DialogTrigger>
        )}
        <DialogTrigger asChild hidden={trigger.hidden}>
          {trigger.type === "element" && trigger.element}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{header.title.label}</DialogTitle>
            <DialogDescription>{header.description}</DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      {trigger.type === "label" && (
        <DrawerTrigger asChild hidden={trigger.hidden}>
          <CustomButton buttonLabel={trigger.label} variant="outline" />
        </DrawerTrigger>
      )}
      <DrawerTrigger asChild hidden={trigger.hidden}>
        {trigger.type === "element" && trigger.element}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{header.title.label}</DrawerTitle>
          <DrawerDescription>{header.description}</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4">{children}</div>
      </DrawerContent>
    </Drawer>
  );
}

export default ResponsiveDialog;
