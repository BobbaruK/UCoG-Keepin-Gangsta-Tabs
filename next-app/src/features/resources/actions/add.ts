"use server";

import { MESSAGES, MESSAGES_FN } from "@/constants/messages";
import { resourcesTitle } from "@/constants/page-title/resources";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { headers } from "next/headers";
import z from "zod";
import { AddResourceSchema } from "../schemas/add-resource";

export const addResource = async (
  values: z.infer<typeof AddResourceSchema>,
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
  const validatedFields = AddResourceSchema.safeParse(values);

  if (!validatedFields.success) return { error: MESSAGES.INVALID_FIELDS };

  const dataSession = await auth.api.getSession({
    headers: await headers(),
  });

  if (!dataSession) {
    return {
      error: MESSAGES_FN({
        resource: resourcesTitle.label.singular.toLowerCase() + "(s)",
      }).RESOURCE_CREATE_UNAUTHORIZED,
    };
  }

  const data = await auth.api.userHasPermission({
    body: {
      userId: dataSession.user.id,
      role: dataSession.user.role as UserRole,
      permission: { resources: ["create"] },
    },
  });

  if (!data.success)
    return {
      error: MESSAGES_FN({
        resource: resourcesTitle.label.singular.toLowerCase() + "(s)",
      }).RESOURCE_CREATE_UNAUTHORIZED,
    };

  const { name, image, category, price: pri, type } = validatedFields.data;

  // If price number is in the negative will be set to 0 (zero)
  const price = Math.sign(pri) === -1 ? 0 : pri;

  try {
    const resource = await db.cog_resource.create({
      data: {
        name,
        image: image || null,
        category,
        price,
        cog_resource_typeId: type,
      },
    });

    return {
      success: MESSAGES_FN({
        resource: resourcesTitle.label.singular.toLowerCase(),
        resourceName: resource.name,
      }).RESOURCE_CREATE_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
