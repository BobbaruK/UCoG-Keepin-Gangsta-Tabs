import { BIO, EMAIL, FIRSTNAME, LASTNAME, USERNAME } from "@/schemas/form";
import { z } from "zod";

export const PersonalSchema = z.object({
  firstName: FIRSTNAME,
  lastName: LASTNAME,
  username: USERNAME,
  slug: z.string(),
  bio: BIO,
});
