"use server";

import { MESSAGES, MESSAGES_FN } from "@/constants/messages";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { UserRole } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { catchError } from "@/lib/utils/catch-error-action";
import { setFullName } from "@/lib/utils/full-name";
import { headers } from "next/headers";
import z from "zod";
import { AddPlaythroughSchema } from "../schemas/add-playthrough";

const UNAUTHORIZED = MESSAGES_FN({
  resource: playthroughTitle.label.plural.toLowerCase(),
}).RESOURCE_CREATE_UNAUTHORIZED;

export const addPlaythrough = async (
  values: z.infer<typeof AddPlaythroughSchema>,
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
  const validatedFields = AddPlaythroughSchema.safeParse(values);

  if (!validatedFields.success) return { error: MESSAGES.INVALID_FIELDS };

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

  if (!user) {
    return {
      error: UNAUTHORIZED,
    };
  }

  const permissions = await auth.api.userHasPermission({
    body: {
      userId: user.id,
      role: user.role as UserRole,
      permissions: {
        playthrough: ["create"],
        crew_member: ["create"],
        police_officers: ["create"],
      },
    },
  });

  if (!permissions.success)
    return {
      error: UNAUTHORIZED,
    };

  const {
    // playthrough
    name,
    seed,
    isPublic,
    passengerRailStation,
    freightRailStation,
    respectForTheLaw,
    laws,
    // boss
    boss_first_name,
    boss_last_name,
    boss_nationality,
    boss_traits,
  } = validatedFields.data;

  try {
    const playthrough = await db.cog_playthrough.create({
      data: {
        name: name || "Noname",
        seed: seed || null,
        is_public: isPublic,
        passenger_rail_station: passengerRailStation,
        freight_rail_station: freightRailStation,
        respect_for_the_law: respectForTheLaw,
        laws: {
          connect: laws.map((law) => ({ id: law })),
        },
        auth_userId: user.id,
      },
    });

    const boss = await db.cog_crew_member.create({
      data: {
        first_name: boss_first_name,
        last_name: boss_last_name,
        full_name: setFullName({
          firstName: boss_first_name,
          lastName: boss_last_name,
        }).outputDB,
        cog_nationalityId: boss_nationality,
        traits: {
          connect: boss_traits.map((trait) => ({ id: trait })),
        },

        turn_recruited: 1,
        is_boss: true,
        cog_playthroughId: playthrough.id,
        auth_userId: user.id,
      },
    });

    return {
      success: MESSAGES_FN({
        resource: playthroughTitle.label.singular.toLowerCase(),
        resourceName: `${playthrough.name} with boss ${boss.full_name}`,
      }).RESOURCE_CREATE_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};
