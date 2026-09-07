import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
  product: ["create", "read", "update", "delete"],
  order: ["create", "read", "update", "delete"],
  category: ["create", "read", "update", "delete"],
  coupon: ["create", "read", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

// customer: browse and shop
export const customer = ac.newRole({
  product: ["read"],
  category: ["read"],
  order: ["create", "read"],
  coupon: ["read"],
});

// superAdmin: full access
export const superAdmin = ac.newRole({
  product: ["create", "read", "update", "delete"],
  order: ["create", "read", "update", "delete"],
  category: ["create", "read", "update", "delete"],
  coupon: ["create", "read", "update", "delete"],
  ...adminAc.statements,
});
