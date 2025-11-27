"use server";

import { MESSAGES, MESSAGES_FN } from "@/constants/messages";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { policeOfficersTitle } from "@/constants/page-title/police-officers";
import { Playthrough } from "@/core/cog/playthrough/types/playthrough";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { headers } from "next/headers";
import z from "zod";
import { AddPoliceOfficerSchema } from "../schemas/add";

const UNAUTHORIZED = MESSAGES_FN({
  resource: policeOfficersTitle.label.singular.toLowerCase() + "(s)",
}).RESOURCE_CREATE_UNAUTHORIZED;

export const addPoliceOfficer = async ({
  playthrough,
  values,
}: {
  playthrough: Playthrough;
  values: z.infer<typeof AddPoliceOfficerSchema>;
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

  if (!dataSession) {
    return {
      error: UNAUTHORIZED,
    };
  }

  const permissions = await auth.api.userHasPermission({
    body: {
      userId: dataSession.user.id,
      role: dataSession.user.role as UserRole,
      permission: { police_officers: ["create"] },
    },
  });

  if (!permissions.success)
    return {
      error: UNAUTHORIZED,
    };

  if (playthrough.auth_userId !== dataSession.user.id)
    return {
      error: MESSAGES_FN({
        resource: playthroughTitle.label.singular.toLowerCase(),
      }).RESOURCE_CREATE_UNAUTHORIZED_OTHER,
    };

  if (playthrough.is_finished)
    return {
      error: `You cannot add data to a finished ${playthroughTitle.label.singular.toLowerCase()}.`,
    };

  try {
    const policeOfficer = await db.cog_police_officer.create({
      data: {
        name: name || "Noname",
        bribed_turn: bribedTurn,
        can_call_in_a_raid,
        has_rival_hooligan_relative,
        political_contact_used,
        cog_playthroughId: playthrough.id,
        auth_userId: dataSession.user.id,
      },
    });

    return {
      success: MESSAGES_FN({
        resource: policeOfficersTitle.label.singular.toLowerCase(),
        resourceName: policeOfficer.name,
      }).RESOURCE_CREATE_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
