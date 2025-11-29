"use server";

import { MESSAGES, MESSAGES_FN } from "@/constants/messages";
import { autoRoutesTitle } from "@/constants/page-title/auto-routes";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { AutoRoute } from "@/core/cog/auto-route/types/auto-route";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { headers } from "next/headers";
import z from "zod";
import { AddAutoRouteSchema } from "../schemas/add";

const UNAUTHORIZED = MESSAGES_FN({
  resource: autoRoutesTitle.label.singular.toLowerCase() + "(s)",
}).RESOURCE_EDIT_UNAUTHORIZED;

export const editAutoRoute = async (
  autoRoute: AutoRoute,
  values: z.infer<typeof AddAutoRouteSchema>,
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
  const validatedFields = AddAutoRouteSchema.safeParse(values);

  if (!validatedFields.success) return { error: MESSAGES.INVALID_FIELDS };

  const { name, steps, crew_member, vehicle_type, route_type } =
    validatedFields.data;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session)
    return {
      error: UNAUTHORIZED,
    };

  const permissions = await auth.api.userHasPermission({
    body: {
      userId: session.user.id,
      role: session.user.role as UserRole,
      permission: { auto_route: ["update"] },
    },
  });

  if (!permissions.success)
    return {
      error: UNAUTHORIZED,
    };

  if (autoRoute.auth_userId !== session.user.id)
    return {
      error: MESSAGES_FN({
        resource: autoRoutesTitle.label.singular.toLowerCase() + "(s)",
      }).RESOURCE_EDIT_UNAUTHORIZED_OTHER,
    };

  if (autoRoute.playthrough.is_finished)
    return {
      error: `You cannot edit data from a finished ${playthroughTitle.label.singular.toLowerCase()}.`,
    };

  try {
    const updatedAutoRoute = await db.cog_auto_route.update({
      where: {
        id: autoRoute.id,
      },
      data: {
        name: name || "Noname",
        steps,
        crew_member_id: crew_member || null,
        cog_vehicle_typeId: vehicle_type || null,
        route_type: {
          set: route_type.map((type) => ({ id: type })),
        },
        cog_playthroughId: autoRoute.cog_playthroughId,
        auth_userId: session.user.id,
      },
    });

    return {
      success: MESSAGES_FN({
        resource: autoRoutesTitle.label.singular.toLowerCase(),
        resourceName: updatedAutoRoute.name,
      }).RESOURCE_EDIT_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
