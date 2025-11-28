"use server";

import { MESSAGES, MESSAGES_FN } from "@/constants/messages";
import { autoRoutesTitle } from "@/constants/page-title/auto-routes";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { Playthrough } from "@/core/cog/playthrough/types/playthrough";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { headers } from "next/headers";
import z from "zod";
import { AddAutoRouteSchema } from "../schemas/add";

const UNAUTHORIZED = MESSAGES_FN({
  resource: autoRoutesTitle.label.singular.toLowerCase() + "(s)",
}).RESOURCE_CREATE_UNAUTHORIZED;

export const addAutoRoute = async ({
  playthrough,
  values,
}: {
  playthrough: Playthrough;

  values: z.infer<typeof AddAutoRouteSchema>;
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
  const validatedFields = AddAutoRouteSchema.safeParse(values);

  if (!validatedFields.success) return { error: MESSAGES.INVALID_FIELDS };

  const { name, steps, crew_member, vehicle_type, route_type } =
    validatedFields.data;

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
      permission: { auto_route: ["create"] },
    },
  });

  if (!permissions.success)
    return {
      error: UNAUTHORIZED,
    };

  if (playthrough.auth_userId !== session.user.id)
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
    const autoRoute = await db.cog_auto_route.create({
      data: {
        name: name || "Noname",
        steps,
        crew_member_id: crew_member,
        cog_vehicle_typeId: vehicle_type,
        cog_playthroughId: playthrough.id,
        auth_userId: session.user.id,
        route_type: {
          connect: route_type.map((type) => ({ id: type })),
        },
      },
    });

    return {
      success: MESSAGES_FN({
        resource: autoRoutesTitle.label.singular.toLowerCase(),
        resourceName: autoRoute.name,
      }).RESOURCE_CREATE_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
