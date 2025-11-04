import { MAX_BIO } from "@/constants/misc";
import z from "zod";

export const BIO = z
  .string()
  .max(MAX_BIO, {
    message: `Bio must not be longer than ${MAX_BIO} characters.`,
  })
  .optional();
