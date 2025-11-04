import z from "zod";

export const RECOVER_CODE = z.string().length(11, {
  message: "Your recovery code must be 11 characters.",
});
