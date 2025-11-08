import {
  cog_law,
  cog_nationality,
  cog_side_effect,
  cog_trait,
} from "@/generated/prisma";
import { UserSession } from "./session";

export type TableRowSelect =
  | {
      type: "users";
      data: UserSession[] | null;
    }
  | {
      type: "side-effects";
      data: cog_side_effect[] | null;
    }
  | {
      type: "traits";
      data: cog_trait[] | null;
    }
  | {
      type: "laws";
      data: cog_law[] | null;
    }
  | {
      type: "nationalities";
      data: cog_nationality[] | null;
    };
