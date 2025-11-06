import { UserRole } from "@/generated/prisma";
import { createAccessControl } from "better-auth/plugins/access";
import {
  userAc,
  adminAc,
  defaultStatements,
} from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
  traits: ["create", "read", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const roles = {
  [UserRole.USER]: ac.newRole({
    ...userAc.statements,
    user: [...userAc.statements.user],
    traits: ["read"],
  }),
  [UserRole.ADMIN]: ac.newRole({
    ...adminAc.statements,
    user: ["list", "create", "delete", "ban"],
    traits: [...statement.traits],
  }),
  [UserRole.OWNER]: ac.newRole({
    ...adminAc.statements,
    user: [...adminAc.statements.user],
    traits: [...statement.traits],
  }),
};
