import { ButtonEffects } from "@/types/button";

/**
 * Global application constants.
 *
 * This module defines all reusable configuration constants
 * such as validation limits, session durations, token expirations,
 * and UI effects used throughout the application.
 *
 * @module constants
 */

/* -------------------------------------------------------------------------- */
/*                              USER VALIDATION                               */
/* -------------------------------------------------------------------------- */

/**
 * Minimum number of characters required for a valid password.
 *
 * @constant
 * @default 6
 * @example
 * if (password.length < MIN_PASSWORD) throw new Error("Password too short");
 */
export const MIN_PASSWORD = 6;

/**
 * Maximum number of characters allowed for a password.
 *
 * @constant
 * @default 30
 */
export const MAX_PASSWORD = 30;

/**
 * Minimum number of characters required for a username.
 *
 * @constant
 * @default 2
 */
export const MIN_USERNAME = 2;

/**
 * Maximum number of characters allowed for a username.
 *
 * @constant
 * @default 50
 */
export const MAX_USERNAME = 50;

/**
 * Minimum number of characters required for a user bio.
 *
 * @constant
 * @default 2
 */
export const MIN_BIO = 2;

/**
 * Maximum number of characters allowed in a user bio.
 *
 * @constant
 * @default 260
 */
export const MAX_BIO = 260;

/**
 * List of accepted email domains for registration.
 *
 * @constant
 * @example
 * // ✅ Valid: "user@gmail.com"
 * // ❌ Invalid: "user@protonmail.com"
 */
export const VALID_DOMAINS = ["gmail.com", "yahoo.com", "outlook.com"];

/* -------------------------------------------------------------------------- */
/*                              UI CONFIGURATION                              */
/* -------------------------------------------------------------------------- */

/**
 * Default button effect style used throughout the UI.
 *
 * @constant
 * @type {ButtonEffects}
 * @default "gooeyLeft"
 */
export const BUTTON_EFFECT: ButtonEffects = "gooeyLeft";

/* -------------------------------------------------------------------------- */
/*                            SESSION CONFIGURATION                           */
/* -------------------------------------------------------------------------- */

/**
 * Duration (in seconds) before a user session expires.
 *
 * @constant
 * @default 60 * 60 * 24 * 30 // 30 days
 */
export const SESSION_EXPIRES = 60 * 60 * 24 * 30;

/**
 * Duration (in seconds) before session freshness expires.
 * Used to determine when a session should be revalidated.
 *
 * @constant
 * @default 60 * 60 * 12 // 12 hours
 */
export const SESSION_FRESH_AGE = 60 * 60 * 12;

/* -------------------------------------------------------------------------- */
/*                             TOKEN EXPIRATION TIMES                         */
/* -------------------------------------------------------------------------- */

/**
 * Expiration time (in seconds) for email verification tokens.
 *
 * @constant
 * @default 60 * 60 // 1 hour
 */
export const VERIFICATION_MAIL_TOKEN_EXPIRES = 60 * 60;

/**
 * Expiration time (in seconds) for password reset tokens.
 *
 * @constant
 * @default 60 * 60 // 1 hour
 */
export const RESET_PASSWORD_TOKEN_EXPIRES = 60 * 60;

/**
 * Expiration time (in seconds) for account deletion tokens.
 *
 * @constant
 * @default 60 * 60 // 1 hour
 */
export const DELETE_ACCOUNT_TOKEN_EXPIRES = 60 * 60;

/**
 * Expiration time (in seconds) for magic link tokens.
 *
 * @constant
 * @default 60 * 5 // 5 minutes
 */
export const MAGIC_LINK_TOKEN_EXPIRES = 60 * 5;

/* -------------------------------------------------------------------------- */
/*                                MISCELLANEOUS                               */
/* -------------------------------------------------------------------------- */

/**
 * Application name that will show in places like google login
 *
 * @constant
 */
export const APP_NAME = "UCoG: Keepin' Gangsta Tabs";

/**
 * Cookies will be set with this prefix
 *
 * @constant
 */
export const COOKIE_PREFIX = "ucog-kgt";

/**
 * Default debounce delay (in milliseconds) for input handlers or requests.
 *
 * @constant
 * @default 500 // milliseconds
 * @example
 * const debouncedSearch = debounce(searchFunction, DEBOUNCE_DEFAULT);
 */
export const DEBOUNCE_DEFAULT = 500; // (milliseconds)

/**
 * Default batch items for handling multiple db queries.
 *
 * @constant
 * @default 2 // items
 */
export const BATCH_ITEMS = 2; // (items)
