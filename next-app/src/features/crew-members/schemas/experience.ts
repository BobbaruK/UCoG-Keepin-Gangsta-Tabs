import z from "zod";

export const experienceSchema = z.object({
  experiences: z.array(
    z.object({
      memberId: z.string().nonempty(),
      levelId: z.string().nonempty({ error: "Please select a level." }),
      value: z.number(),
    }),
  ),
});
