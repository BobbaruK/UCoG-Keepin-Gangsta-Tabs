"use server";

import { MESSAGES, MESSAGES_FN } from "@/constants/messages";
import { lawsTitle } from "@/constants/page-title/laws";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { headers } from "next/headers";
import z from "zod";
import { AddLawSchema } from "../schemas/add-law";

export const editLaw = async (
  id: string,
  values: z.infer<typeof AddLawSchema>,
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
  const validatedFields = AddLawSchema.safeParse(values);

  if (!validatedFields.success) return { error: MESSAGES.INVALID_FIELDS };

  const dataSession = await auth.api.getSession({
    headers: await headers(),
  });

  if (!dataSession) {
    return {
      error: MESSAGES_FN({
        resource: lawsTitle.label.singular.toLowerCase() + "(s)",
      }).RESOURCE_CREATE_UNAUTHORIZED,
    };
  }

  const data = await auth.api.userHasPermission({
    body: {
      userId: dataSession.user.id,
      role: dataSession.user.role as UserRole,
      permission: { laws: ["update"] },
    },
  });

  if (!data.success)
    return {
      error: MESSAGES_FN({
        resource: lawsTitle.label.singular.toLowerCase() + "(s)",
      }).RESOURCE_CREATE_UNAUTHORIZED,
    };

  const {
    name,
    description,
    enact: en,
    revoke: re,
    type,
    sideEffect,
  } = validatedFields.data;

  // If enact and revoke numbers are in the negative will be 0 (zero)
  const enact = Math.sign(en) === -1 ? 0 : en;
  const revoke = Math.sign(re) === -1 ? 0 : re;

  try {
    const law = await db.cog_law.update({
      where: {
        id,
      },
      data: {
        name,
        description: description || null,
        enact,
        revoke,
        type,
        cog_side_effectId: sideEffect || null,
      },
    });

    return {
      success: MESSAGES_FN({
        resource: lawsTitle.label.singular.toLowerCase(),
        resourceName: law.name,
      }).RESOURCE_EDIT_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
