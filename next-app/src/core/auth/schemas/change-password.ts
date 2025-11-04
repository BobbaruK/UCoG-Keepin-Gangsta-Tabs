import { PASSWORD } from "@/schemas/form";
import { z } from "zod";

export const ChangePasswordSchema = z
  .object({
    currentPassword: PASSWORD,
    newPassword: PASSWORD,
    confirmNewPassword: PASSWORD,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords do not match",
  });
