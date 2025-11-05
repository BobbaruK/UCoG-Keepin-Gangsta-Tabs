import { MIN_USERNAME, MAX_USERNAME } from "@/constants/misc";
import z from "zod";

export const NAME = z
  .string()
  .min(MIN_USERNAME, {
    message: `Name must have ${MIN_USERNAME} or more characters.`,
  })
  .max(MAX_USERNAME, {
    message: `Name must have ${MAX_USERNAME} or fewer characters.`,
  });