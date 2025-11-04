import { EMAIL } from "@/schemas/form";
import { z } from "zod";

export const MagicLinkSchema = z.object({
  email: EMAIL,
});
