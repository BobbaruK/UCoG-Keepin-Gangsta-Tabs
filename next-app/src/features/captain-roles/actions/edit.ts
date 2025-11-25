"use server";

import { MESSAGES, MESSAGES_FN } from "@/constants/messages";
import { captainRolesTitle } from "@/constants/page-title/captain-roles";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { headers } from "next/headers";
import z from "zod";
import { AddCaptainRoleSchema } from "../schemas/add-captain-role";

const UNAUTHORIZED = MESSAGES_FN({
  resource: captainRolesTitle.label.plural.toLowerCase(),
}).RESOURCE_EDIT_UNAUTHORIZED;

export const editCaptainRole = async (
  id: string,
  values: z.infer<typeof AddCaptainRoleSchema>,
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
  const validatedFields = AddCaptainRoleSchema.safeParse(values);

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
      permission: { captain_roles: ["update"] },
    },
  });

  if (!data.success)
    return {
      error: UNAUTHORIZED,
    };

  const { name, image, description, sideEffect } = validatedFields.data;

  try {
    const captainRole = await db.cog_captain_role.update({
      where: {
        id,
      },
      data: {
        name: name || "Noname",
        image: image || null,
        description: description || null,
        cog_side_effectId: sideEffect || null,
      },
    });

    return {
      success: MESSAGES_FN({
        resource: captainRolesTitle.label.singular.toLowerCase(),
        resourceName: captainRole.name,
      }).RESOURCE_EDIT_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
