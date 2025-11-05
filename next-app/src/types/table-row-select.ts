import { cog_side_effect } from "@/generated/prisma";
import { UserSession } from "./session";

export type TableRowSelect =
  | {
      type: "users";
      data: UserSession[] | null;
    }
  | {
      type: "side-effects";
      data: cog_side_effect[] | null;
    };
