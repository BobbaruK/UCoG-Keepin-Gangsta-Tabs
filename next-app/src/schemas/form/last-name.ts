import { MAX_USERNAME, MIN_USERNAME } from "@/constants/misc";
import z from "zod";

export const LASTNAME = z
  .string()
  .min(MIN_USERNAME, {
    message: `Last Name${MIN_USERNAME} or more characters long`,
  })
  .max(MAX_USERNAME, {
    message: `Last Name${MAX_USERNAME} or fewer characters long`,
  });
