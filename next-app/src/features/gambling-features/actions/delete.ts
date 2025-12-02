"use server";

import { MESSAGES_FN } from "@/constants/messages";
import { gamblingFeatureTitle } from "@/constants/page-title/gambling-feature";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { headers } from "next/headers";

const UNAUTHORIZED = MESSAGES_FN({
  resource: gamblingFeatureTitle.label.singular.toLowerCase(),
}).RESOURCE_DELETE_UNAUTHORIZED;

export const deleteGamblingFeature = async (
  traitId: string,
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
      permission: { gambling_features: ["delete"] },
    },
  });

  if (!permissions.success)
    return {
      error: UNAUTHORIZED,
    };

  try {
    const gamblingFeature = await db.cog_gambling_feature.delete({
      where: { id: traitId },
    });

    return {
      success: MESSAGES_FN({
        resource: gamblingFeatureTitle.label.singular.toLowerCase() + "(s)",
        resourceName: gamblingFeature.name,
      }).RESOURCE_DELETE_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
