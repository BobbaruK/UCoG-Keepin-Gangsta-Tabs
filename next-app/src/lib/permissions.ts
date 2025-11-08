import { UserRole } from "@/generated/prisma";
import { createAccessControl } from "better-auth/plugins/access";
import {
  userAc,
  adminAc,
  defaultStatements,
} from "better-auth/plugins/admin/access";

const crud = ["create", "read", "update", "delete"];

const statement = {
  ...defaultStatements,
  traits: crud,
  sideEffects: crud,
  laws: crud,
} as const;

export const ac = createAccessControl(statement);

export const roles = {
  [UserRole.USER]: ac.newRole({
    ...userAc.statements,
    user: [...userAc.statements.user],
    sideEffects: ["read"],
    traits: ["read"],
    laws: ["read"],
  }),
  [UserRole.ADMIN]: ac.newRole({
    ...adminAc.statements,
    user: ["list", "create", "delete", "ban"],
    sideEffects: [...statement.sideEffects],
    traits: [...statement.traits],
    laws: [...statement.laws],
  }),
  [UserRole.OWNER]: ac.newRole({
    ...adminAc.statements,
    user: [...adminAc.statements.user],
    sideEffects: [...statement.sideEffects],
    traits: [...statement.traits],
    laws: [...statement.laws],
  }),
};
