import { MAX_USERNAME, MIN_USERNAME } from "@/constants/misc";
import z from "zod";

export const FIRSTNAME = z
  .string()
  .min(MIN_USERNAME, {
    message: `First Name${MIN_USERNAME} or more characters long`,
  })
  .max(MAX_USERNAME, {
    message: `First Name${MAX_USERNAME} or fewer characters long`,
  });
