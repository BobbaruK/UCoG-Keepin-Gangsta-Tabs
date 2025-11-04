import { auth } from "@/lib/auth";

export type ErrorCode = keyof typeof auth.$ERROR_CODES;
