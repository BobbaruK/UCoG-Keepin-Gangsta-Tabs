import { EMAIL } from "@/schemas/form";
import { z } from "zod";

export const ChangeEmailSchema = z.object({
  oldEmail: EMAIL,
  newEmail: EMAIL,
});
