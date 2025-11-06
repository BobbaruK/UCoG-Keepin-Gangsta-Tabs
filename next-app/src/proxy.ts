import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";
import { COOKIE_PREFIX } from "./constants/misc";
import {
  API_AUTH_PREFIX,
  AUTH_ROUTES,
  FORBIDDEN_ROUTES,
} from "./constants/routes";

export async function proxy(request: NextRequest) {
  const { nextUrl } = request;
  const sessionCookie = getSessionCookie(request, {
    cookiePrefix: COOKIE_PREFIX,
  });

  const isLoggedIn = !!sessionCookie;

  const isApiAuthRoute = nextUrl.pathname.startsWith(API_AUTH_PREFIX);
  // const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);
  const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname);
  const isForbiddenRoute = FORBIDDEN_ROUTES.includes(nextUrl.pathname);

  if (isApiAuthRoute) return;

  if (isForbiddenRoute) return NextResponse.redirect(new URL("/", request.url));

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return;
  }

  // if (!isLoggedIn && !isPublicRoute) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  return;
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
