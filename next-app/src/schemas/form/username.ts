import { MAX_USERNAME, MIN_USERNAME } from "@/constants/misc";
import z from "zod";

export const USERNAME = z
  .string()
  .min(MIN_USERNAME, {
    message: `Username must be ${MIN_USERNAME} or more characters long`,
  })
  .max(MAX_USERNAME, {
    message: `Username must be ${MAX_USERNAME} or fewer characters long`,
  })
  .regex(
    /^[a-zA-Z0-9._]+$/,
    "Username can only contain alphanumeric characters, underscores, and dots",
  );
