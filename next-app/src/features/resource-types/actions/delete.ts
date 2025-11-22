"use server";

import { MESSAGES_FN } from "@/constants/messages";
import { resourceTypesTitle } from "@/constants/page-title/resource-types";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { headers } from "next/headers";

export const deleteResourceType = async (
  resourceTypeId: string,
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
  const dataSession = await auth.api.getSession({
    headers: await headers(),
  });

  if (!dataSession) {
    return {
      error: MESSAGES_FN({
        resource: resourceTypesTitle.label.singular.toLowerCase() + "(s)",
      }).RESOURCE_DELETE_UNAUTHORIZED,
    };
  }

  const data = await auth.api.userHasPermission({
    body: {
      userId: dataSession.user.id,
      role: dataSession.user.role as UserRole,
      permission: { resource_types: ["delete"] },
    },
  });

  if (!data.success)
    return {
      error: MESSAGES_FN({
        resource: resourceTypesTitle.label.singular.toLowerCase() + "(s)",
      }).RESOURCE_DELETE_UNAUTHORIZED,
    };

  try {
    const resourceTypes = await db.cog_resource_type.delete({
      where: { id: resourceTypeId },
    });

    return {
      success: MESSAGES_FN({
        resource: resourceTypesTitle.label.singular.toLowerCase() + "(s)",
        resourceName: resourceTypes.name,
      }).RESOURCE_DELETE_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
