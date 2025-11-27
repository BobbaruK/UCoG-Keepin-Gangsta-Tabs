"use server";

import { MESSAGES, MESSAGES_FN } from "@/constants/messages";
import { autoRouteTypesTitle } from "@/constants/page-title/auto-route-types";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { headers } from "next/headers";
import z from "zod";
import { AddAutoRouteTypeSchema } from "../schemas/add-auto-route-type";

const UNAUTHORIZED = MESSAGES_FN({
  resource: autoRouteTypesTitle.label.plural.toLowerCase(),
}).RESOURCE_EDIT_UNAUTHORIZED;

export const editAutoRouteType = async (
  id: string,
  values: z.infer<typeof AddAutoRouteTypeSchema>,
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
  const validatedFields = AddAutoRouteTypeSchema.safeParse(values);

  if (!validatedFields.success) return { error: MESSAGES.INVALID_FIELDS };

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      error: UNAUTHORIZED,
    };
  }

  const permissions = await auth.api.userHasPermission({
    body: {
      userId: session.user.id,
      role: session.user.role as UserRole,
      permission: { auto_route_types: ["update"] },
    },
  });

  if (!permissions.success)
    return {
      error: UNAUTHORIZED,
    };

  const { name } = validatedFields.data;

  try {
    const routeType = await db.cog_auto_route_type.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });

    return {
      success: MESSAGES_FN({
        resource: autoRouteTypesTitle.label.singular.toLowerCase(),
        resourceName: routeType.name,
      }).RESOURCE_EDIT_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
