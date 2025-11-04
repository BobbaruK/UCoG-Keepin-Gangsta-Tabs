import { UserSession } from "./session";

export type TableRowSelect = {
  type: "users";
  data: UserSession[] | null;
};
