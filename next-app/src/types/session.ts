import { auth } from "@/lib/auth";

export type Session = typeof auth.$Infer.Session;
export type SessionObj = typeof auth.$Infer.Session.session;
export type UserSession = typeof auth.$Infer.Session.user;
