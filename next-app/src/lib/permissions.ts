import { UserRole } from "@/generated/prisma";
import { createAccessControl } from "better-auth/plugins/access";
import {
  userAc,
  adminAc,
  defaultStatements,
} from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
} as const;

export const ac = createAccessControl(statement);

export const roles = {
  [UserRole.USER]: ac.newRole({
    ...userAc.statements,
    user: [...userAc.statements.user],
  }),
  [UserRole.ADMIN]: ac.newRole({
    ...adminAc.statements,
    user: ["list", "create", "delete", "ban"],
  }),
  [UserRole.OWNER]: ac.newRole({
    ...adminAc.statements,
    user: [...adminAc.statements.user],
  }),
};
