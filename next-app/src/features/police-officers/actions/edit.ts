"use server";

import { MESSAGES, MESSAGES_FN } from "@/constants/messages";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { policeOfficersTitle } from "@/constants/page-title/police-officers";
import { PoliceOfficer } from "@/core/db/police-officer/types/police-officer";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { headers } from "next/headers";
import z from "zod";
import { AddPoliceOfficerSchema } from "../schemas/add";

const UNAUTHORIZED = MESSAGES_FN({
  resource: policeOfficersTitle.label.singular.toLowerCase() + "(s)",
}).RESOURCE_EDIT_UNAUTHORIZED;

export const editPoliceOfficer = async (
  policeOfficer: PoliceOfficer,
  values: z.infer<typeof AddPoliceOfficerSchema>,
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
  const validatedFields = AddPoliceOfficerSchema.safeParse(values);

  if (!validatedFields.success) return { error: MESSAGES.INVALID_FIELDS };

  const {
    name,
    bribedTurn,
    can_call_in_a_raid,
    has_rival_hooligan_relative,
    political_contact_used,
  } = validatedFields.data;

  const dataSession = await auth.api.getSession({
    headers: await headers(),
  });

  if (!dataSession)
    return {
      error: UNAUTHORIZED,
    };

  const permission = await auth.api.userHasPermission({
    body: {
      userId: dataSession.user.id,
      role: dataSession.user.role as UserRole,
      permission: { police_officers: ["update"] },
    },
  });

  if (!permission.success)
    return {
      error: UNAUTHORIZED,
    };

  if (policeOfficer.auth_userId !== dataSession.user.id)
    return {
      error: MESSAGES_FN({
        resource: policeOfficersTitle.label.singular.toLowerCase() + "(s)",
      }).RESOURCE_EDIT_UNAUTHORIZED_OTHER,
    };

  if (policeOfficer.cogPlaythrough.is_finished)
    return {
      error: `You cannot edit data from a finished ${playthroughTitle.label.singular.toLowerCase()}.`,
    };

  try {
    const data = await db.cog_police_officer.update({
      where: {
        id: policeOfficer.id,
      },
      data: {
        name: name || "Noname",
        bribed_turn: bribedTurn,
        can_call_in_a_raid,
        has_rival_hooligan_relative,
        political_contact_used,
      },
    });

    return {
      success: MESSAGES_FN({
        resource: policeOfficersTitle.label.singular.toLowerCase(),
        resourceName: data.name,
      }).RESOURCE_EDIT_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
