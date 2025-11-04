import { buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";

export type ButtonVariants = VariantProps<typeof buttonVariants>;

export type ButtonEffects = ButtonVariants["effect"];
