import { CODE } from "@/schemas/form";
import z from "zod";

export const OTP = z.object({
  code: CODE,
  remember: z.boolean(),
});
