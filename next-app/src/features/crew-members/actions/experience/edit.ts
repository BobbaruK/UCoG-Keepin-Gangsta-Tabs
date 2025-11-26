"use server";

import { MESSAGES, MESSAGES_FN } from "@/constants/messages";
import { crewMembersTitle } from "@/constants/page-title/crew-members";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { headers } from "next/headers";
import z from "zod";
import { experienceSchema } from "../../schemas/experience";

const UNAUTHORIZED = MESSAGES_FN({
  resource: crewMembersTitle.label.singular.toLowerCase() + "(s)",
}).RESOURCE_EDIT_UNAUTHORIZED;

export const editExperiences = async ({
  memberId,
  values,
}: {
  memberId: string;
  values: z.infer<typeof experienceSchema>;
}): Promise<
  | {
      error: string;
      success?: undefined;
    }
  | {
      success: string;
      error?: undefined;
    }
> => {
  const validatedFields = experienceSchema.safeParse(values);

  if (!validatedFields.success) return { error: MESSAGES.INVALID_FIELDS };

  const { experiences: formExperience } = validatedFields.data;

  const dataSession = await auth.api.getSession({
    headers: await headers(),
  });

  if (!dataSession) {
    return {
      error: UNAUTHORIZED,
    };
  }

  const member = await db.cog_crew_member.findUnique({
    where: {
      id: memberId,
    },
  });

  if (member?.is_dead) {
    return {
      error: `You cannot add or edit experiences for a dead ${crewMembersTitle.label.singular.toLowerCase()}`,
    };
  }

  const data = await auth.api.userHasPermission({
    body: {
      userId: dataSession.user.id,
      role: dataSession.user.role as UserRole,
      permission: { crew_experience: ["update", "delete"] },
    },
  });

  if (!data.success)
    return {
      error: UNAUTHORIZED,
    };

  try {
    await db.cog_crew_experience.deleteMany({
      where: {
        cog_crew_memberId: memberId,
      },
    });

    await db.cog_crew_experience.createMany({
      data: [
        ...formExperience.map((experience) => ({
          cog_crew_memberId: experience.memberId,
          cog_crew_levelId: experience.levelId,
          value: experience.value,
        })),
      ],
    });

    return {
      success: MESSAGES_FN({
        resource: "experiences",
      }).RESOURCE_EDIT_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
