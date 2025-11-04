import { EMAIL, PASSWORD, USERNAME } from "@/schemas/form";
import { z } from "zod";

export const LoginSchema = z.object({
  email: z.union([EMAIL, USERNAME]),
  password: PASSWORD,
});
