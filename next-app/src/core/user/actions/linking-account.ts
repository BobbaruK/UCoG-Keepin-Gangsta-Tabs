"use server";

import { MESSAGES } from "@/constants/messages";
import {
  DEFAULT_API_ERROR_REDIRECT,
  DEFAULT_LOGIN_REDIRECT,
} from "@/constants/routes";
import { auth } from "@/lib/auth";
import { APIError } from "better-auth/api";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const linkAccount = async (provider: string) => {
  try {
    const { url } = await auth.api.linkSocialAccount({
      body: {
        provider,
        callbackURL: DEFAULT_LOGIN_REDIRECT,
        errorCallbackURL: DEFAULT_API_ERROR_REDIRECT,
      },
      headers: await headers(),
    });

    redirect(url);

    // revalidatePath("/");

    // return {
    //   success: `${MESSAGES.ACCOUNT_LINK_SUCCESSFUL}`,
    //   url,
    // };
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    if (error instanceof APIError)
      return {
        error: error.message,
      };

    throw error;
  }
};

export const unlinkAccount = async (provider: string) => {
  try {
    await auth.api.unlinkAccount({
      body: {
        providerId: provider,
      },
      headers: await headers(),
    });

    revalidatePath("/");

    return {
      success: `${MESSAGES.ACCOUNT_UNLINK_SUCCESSFUL}`,
    };
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    if (error instanceof APIError)
      return {
        error: error.message,
      };

    throw error;
  }
};
