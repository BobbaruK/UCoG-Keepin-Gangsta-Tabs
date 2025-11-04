import { PASSWORD } from "@/schemas/form";
import { z } from "zod";

export const NewPasswordSchema = z
  .object({
    password: PASSWORD,
    confirmPassword: PASSWORD,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
