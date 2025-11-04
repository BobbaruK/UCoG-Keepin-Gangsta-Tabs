export const DEFAULT_LOGIN_REDIRECT = "/";
export const DEFAULT_API_ERROR_REDIRECT = "/auth/error";
export const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/new-password",
];
export const API_AUTH_PREFIX = "/api/auth";
export const PUBLIC_ROUTES = [
  "/",
  "/two-factor-verification",
  "/auth/error",
  "/goodbye",
  "/recover-account",
];
export const FORBIDDEN_ROUTES: string[] = [
  // "/"
];
