"use server";

import { MESSAGES } from "@/constants/messages";
import {
  DEFAULT_API_ERROR_REDIRECT,
  DEFAULT_LOGIN_REDIRECT,
} from "@/constants/routes";
import { LoginSchema } from "@/core/auth/schemas/login";
import { MagicLinkSchema } from "@/core/auth/schemas/magic-link";
import { auth } from "@/lib/auth";
import { catchError } from "@/lib/utils/catch-error-action";
import { EMAIL } from "@/schemas/form";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";

type SignInType = "email" | "username";

const emailSchema = EMAIL;
// const usernameSchema = USERNAME;

const handleSignIn = async (
  type: SignInType,
  values: z.infer<typeof LoginSchema>,
): Promise<
  | {
      error: string;
      success?: undefined;
      redirectOTP?: undefined;
    }
  | {
      success: string;
      redirectOTP: boolean;
      error?: undefined;
    }
  | {
      success: string;
      error?: undefined;
      redirectOTP?: undefined;
    }
> => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) return { error: MESSAGES.INVALID_FIELDS };

  const { email, password } = validatedFields.data;
  try {
    let response;

    switch (type) {
      case "email":
        response = await auth.api.signInEmail({
          body: {
            email,
            password,
          },
          headers: await headers(),
          // asResponse : true
        });
        break;

      case "username":
        response = await auth.api.signInUsername({
          body: {
            username: email, // username and email are the same field
            password,
          },
          headers: await headers(),
        });
        break;
    }

    // manual set cookies
    // const setCookieHeader = res.headers.get("set-cookie");
    // if (setCookieHeader) {
    //   const cookie = parseSetCookieHeader(setCookieHeader);
    //   const cookieStore = await cookies();

    //   const [key, cookieAttrs] = [...cookie.entries()][0];
    //   const value = cookieAttrs.value;
    //   const maxAge = cookieAttrs["max-age"];
    //   const path = cookieAttrs.path;
    //   const httpOnly = cookieAttrs.httponly;
    //   const sameSite = cookieAttrs.samesite;

    //   cookieStore.set(key, decodeURIComponent(value), {
    //     maxAge,
    //     path,
    //     httpOnly,
    //     sameSite,
    //   });
    // }

    revalidatePath("/");

    if (response && "twoFactorRedirect" in response)
      return {
        success: MESSAGES.ENTER_OTP,
        redirectOTP: true,
      };

    return {
      success: MESSAGES.LOGIN_SUCCESS,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const signIn = async (
  values: z.infer<typeof LoginSchema>,
): Promise<
  | {
      error: string;
      success?: undefined;
      redirectOTP?: undefined;
    }
  | {
      success: string;
      redirectOTP: boolean;
      error?: undefined;
    }
  | {
      success: string;
      error?: undefined;
      redirectOTP?: undefined;
    }
> => {
  const type: SignInType = emailSchema.safeParse(values.email).success
    ? "email"
    : "username";

  return handleSignIn(type, values);
};

export const signInMagicLink = async (
  values: z.infer<typeof MagicLinkSchema>,
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
  const validatedFields = MagicLinkSchema.safeParse(values);

  if (!validatedFields.success) return { error: MESSAGES.INVALID_FIELDS };

  const { email } = validatedFields.data;

  try {
    await auth.api.signInMagicLink({
      body: {
        email,
        callbackURL: DEFAULT_LOGIN_REDIRECT,
        newUserCallbackURL: DEFAULT_LOGIN_REDIRECT,
        errorCallbackURL: DEFAULT_API_ERROR_REDIRECT,
      },
      headers: await headers(),
    });

    revalidatePath("/");

    return {
      success: MESSAGES.MAGIC_LINK_SEND,
    };
  } catch (error) {
    return catchError(error);
  }
};
