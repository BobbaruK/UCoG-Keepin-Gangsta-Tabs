import { EMAIL } from "@/schemas/form";
import { z } from "zod";

export const ResetPasswordSchema = z.object({
  email: EMAIL,
});
