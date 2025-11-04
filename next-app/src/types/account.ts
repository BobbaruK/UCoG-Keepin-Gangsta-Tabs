import { auth } from "@/lib/auth";

export type Account = Awaited<
  ReturnType<typeof auth.api.listUserAccounts>
>[number];
