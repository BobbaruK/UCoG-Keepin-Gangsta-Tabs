import z from "zod";

export const NONNEGATIVE_NUMBER = (resource?: string) =>
  z.number().nonnegative({
    error: resource
      ? `${resource} must be a non negative number.`
      : "Must be a non negative number.",
  });
