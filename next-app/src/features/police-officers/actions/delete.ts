"use server";

import { MESSAGES_FN } from "@/constants/messages";
import { policeOfficersTitle } from "@/constants/page-title/police-officers";
import { PoliceOfficer } from "@/core/db/police-officer/types/police-officer";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { headers } from "next/headers";

const UNAUTHORIZED = MESSAGES_FN({
  resource: policeOfficersTitle.label.singular.toLowerCase() + "(s)",
}).RESOURCE_DELETE_UNAUTHORIZED;

export const deletePoliceOfficer = async (
  policeOfficer: PoliceOfficer,
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
      error: UNAUTHORIZED,
    };
  }

  const user = await db.auth_user.findUnique({
    where: {
      id: dataSession.user.id,
    },
  });

  if (!user)
    return {
      error: UNAUTHORIZED,
    };

  if (policeOfficer.auth_userId !== user.id)
    return {
      error: MESSAGES_FN({
        resource: policeOfficersTitle.label.singular.toLowerCase() + "(s)",
      }).RESOURCE_DELETE_UNAUTHORIZED_OTHER,
    };

  const permissions = await auth.api.userHasPermission({
    body: {
      userId: dataSession.user.id,
      role: dataSession.user.role as UserRole,
      permissions: { police_officers: ["delete"] },
    },
  });

  if (!permissions.success)
    return {
      error: UNAUTHORIZED,
    };

  try {
    const data = await db.cog_police_officer.delete({
      where: { id: policeOfficer.id },
    });

    return {
      success: MESSAGES_FN({
        resource: policeOfficersTitle.label.singular.toLowerCase() + "(s)",
        resourceName: data.name,
      }).RESOURCE_DELETE_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
