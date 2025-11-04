"use server";

import { MESSAGES } from "@/constants/messages";
import { auth } from "@/lib/auth";
import { catchError } from "@/lib/utils/catch-error-action";
import { headers } from "next/headers";

export const revokeSelectedSesh = async (
  token: string,
): Promise<
  | {
      success: string;
      error?: undefined;
    }
  | {
      error: string;
      success?: undefined;
    }
> => {
  try {
    await auth.api.revokeSession({
      body: {
        token,
      },
      headers: await headers(),
    });

    return {
      success: MESSAGES.SESSION_REVOKED,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const revokeOtherSeshs = async (): Promise<
  | {
      success: string;
      error?: undefined;
    }
  | {
      error: string;
      success?: undefined;
    }
> => {
  try {
    await auth.api.revokeOtherSessions({
      headers: await headers(),
    });

    return {
      success: MESSAGES.SESSION_REVOKED_OTHERS,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const revokeSeshs = async (): Promise<
  | {
      success: string;
      error?: undefined;
    }
  | {
      error: string;
      success?: undefined;
    }
> => {
  try {
    await auth.api.revokeSessions({
      headers: await headers(),
    });

    return {
      success: MESSAGES.SESSION_REVOKED_ALL,
    };
  } catch (error) {
    return catchError(error);
  }
};
