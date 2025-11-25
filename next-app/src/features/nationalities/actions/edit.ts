"use server";

import { MESSAGES, MESSAGES_FN } from "@/constants/messages";
import { nationalitiesTitle } from "@/constants/page-title/nationalities";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { headers } from "next/headers";
import z from "zod";
import { AddNationalitySchema } from "../schemas/add-nationality";

const UNAUTHORIZED = MESSAGES_FN({
  resource: nationalitiesTitle.label.singular.toLowerCase(),
}).RESOURCE_EDIT_UNAUTHORIZED;

export const editNationality = async (
  id: string,
  values: z.infer<typeof AddNationalitySchema>,
): Promise<
  | {
      error: string;
      success?: undefined;
    }
  | {
      success: string;
      error?: undefined;
    }
> => {
  const validatedFields = AddNationalitySchema.safeParse(values);

  if (!validatedFields.success) return { error: MESSAGES.INVALID_FIELDS };

  const dataSession = await auth.api.getSession({
    headers: await headers(),
  });

  if (!dataSession) {
    return {
      error: UNAUTHORIZED,
    };
  }

  const data = await auth.api.userHasPermission({
    body: {
      userId: dataSession.user.id,
      role: dataSession.user.role as UserRole,
      permission: { nationalities: ["update"] },
    },
  });

  if (!data.success)
    return {
      error: UNAUTHORIZED,
    };

  const { name, flag, description } = validatedFields.data;

  try {
    const nationality = await db.cog_nationality.update({
      where: {
        id,
      },
      data: {
        name,
        flag: flag || null,
        description: description || null,
      },
    });

    return {
      success: MESSAGES_FN({
        resource: nationalitiesTitle.label.singular.toLowerCase(),
        resourceName: nationality.name,
      }).RESOURCE_EDIT_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
