"use server";

import { MESSAGES, MESSAGES_FN } from "@/constants/messages";
import { resourceTypesTitle } from "@/constants/page-title/resource-types";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { headers } from "next/headers";
import z from "zod";
import { AddResourceTypeSchema } from "../schemas/add-resource-type";

const UNAUTHORIZED = MESSAGES_FN({
  resource: resourceTypesTitle.label.singular.toLowerCase(),
}).RESOURCE_CREATE_UNAUTHORIZED;

export const addResourceType = async (
  values: z.infer<typeof AddResourceTypeSchema>,
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
  const validatedFields = AddResourceTypeSchema.safeParse(values);

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
      permission: { resource_types: ["create"] },
    },
  });

  if (!data.success)
    return {
      error: UNAUTHORIZED,
    };

  const { name, capacity: ca } = validatedFields.data;

  // If capacity number is in the negative will be set to 0 (zero)
  const capacity = Math.sign(ca) === -1 ? 0 : ca;

  try {
    const resourceType = await db.cog_resource_type.create({
      data: {
        name: name || "Noname",
        capacity,
      },
    });

    return {
      success: MESSAGES_FN({
        resource: resourceTypesTitle.label.singular.toLowerCase(),
        resourceName: resourceType.name,
      }).RESOURCE_CREATE_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
