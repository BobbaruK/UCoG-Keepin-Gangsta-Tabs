import { UserRole } from "@/generated/prisma";
import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc,
  defaultStatements,
  userAc,
} from "better-auth/plugins/admin/access";

const CRUD = ["create", "read", "update", "delete"] as const;

const statement = {
  ...defaultStatements,
  traits: CRUD,
  sideEffects: CRUD,
  laws: CRUD,
  nationalities: CRUD,
  vehicle_types: CRUD,
  resource_types: CRUD,
  resources: CRUD,
  captain_roles: CRUD,
  crew_levels: CRUD,
  playthrough: CRUD,
  crew_member: CRUD,
  crew_experience: CRUD,
  police_officers: CRUD,
} as const;

export const ac = createAccessControl(statement);

export const roles = {
  [UserRole.USER]: ac.newRole({
    ...userAc.statements,
    user: [...userAc.statements.user],
    sideEffects: ["read"],
    traits: ["read"],
    laws: ["read"],
    nationalities: ["read"],
    vehicle_types: ["read"],
    resource_types: ["read"],
    resources: ["read"],
    captain_roles: ["read"],
    crew_levels: ["read"],
    playthrough: [...statement.playthrough],
    crew_member: [...statement.crew_member],
    crew_experience: [...statement.crew_experience],
    police_officers: [...statement.police_officers],
  }),
  [UserRole.ADMIN]: ac.newRole({
    ...adminAc.statements,
    user: ["list", "ban"],
    sideEffects: [...statement.sideEffects],
    traits: [...statement.traits],
    laws: [...statement.laws],
    nationalities: [...statement.nationalities],
    vehicle_types: [...statement.vehicle_types],
    resource_types: [...statement.resource_types],
    resources: [...statement.resources],
    captain_roles: [...statement.captain_roles],
    crew_levels: [...statement.crew_levels],
    playthrough: [...statement.playthrough],
    crew_member: [...statement.crew_member],
    crew_experience: [...statement.crew_experience],
    police_officers: [...statement.police_officers],
  }),
  [UserRole.OWNER]: ac.newRole({
    ...adminAc.statements,
    user: [...adminAc.statements.user],
    sideEffects: [...statement.sideEffects],
    traits: [...statement.traits],
    laws: [...statement.laws],
    nationalities: [...statement.nationalities],
    vehicle_types: [...statement.vehicle_types],
    resource_types: [...statement.resource_types],
    resources: [...statement.resources],
    captain_roles: [...statement.captain_roles],
    crew_levels: [...statement.crew_levels],
    playthrough: [...statement.playthrough],
    crew_member: [...statement.crew_member],
    crew_experience: [...statement.crew_experience],
    police_officers: [...statement.police_officers],
  }),
};
