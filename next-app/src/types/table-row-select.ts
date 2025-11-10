import {
  cog_law,
  cog_nationality,
  cog_playthrough,
  cog_resource,
  cog_resource_type,
  cog_side_effect,
  cog_trait,
  cog_vehicle_type,
} from "@/generated/prisma";
import { UserSession } from "./session";

// TODO: update all this to generics

export type TableRowSelect<T> =
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
    }
  | {
      type: "vehicle-types";
      data: cog_vehicle_type[] | null;
    }
  | {
      type: "resource-types";
      data: cog_resource_type[] | null;
    }
  | {
      type: "resources";
      data: cog_resource[] | null;
    }
  | {
      type: "playthrough";
      data: T[] | null;
    };
