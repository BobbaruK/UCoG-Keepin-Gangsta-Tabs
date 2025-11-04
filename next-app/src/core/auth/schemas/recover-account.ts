import { RECOVER_CODE } from "@/schemas/form/recover-code";
import { z } from "zod";

export const RecoverAccountSchema = z.object({
  code: RECOVER_CODE,
  remember: z.boolean(),
});
