import z from "zod";

export const EMAIL = z.email({ message: "Invalid email address" });
