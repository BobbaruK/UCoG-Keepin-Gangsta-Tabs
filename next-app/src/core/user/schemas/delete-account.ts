import { EMAIL } from "@/schemas/form";
import { z } from "zod";

export const DeleteAccountSchema = z.object({
  email: EMAIL,
});
