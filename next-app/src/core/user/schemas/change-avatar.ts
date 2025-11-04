import { z } from "zod";

export const ChangeAvatarSchema = z.object({
  url: z
    .string()
    // .startsWith("https://", { message: "Must provide secure URL" }),
  // TODO: better validation here
  // .endsWith(".svg", { message: "Only svg's images allowed" }),
});
