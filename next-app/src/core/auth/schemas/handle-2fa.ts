import { PASSWORD } from "@/schemas/form";
import { z } from "zod";

export const Handle2faSchema = z.object({
  password: PASSWORD,
});
