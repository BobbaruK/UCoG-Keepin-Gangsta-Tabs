import { z } from "zod";

export const BanUserSchema = z.object({
  banReason: z.string().optional(),
  banExpiresIn: z.number().optional(),
});
