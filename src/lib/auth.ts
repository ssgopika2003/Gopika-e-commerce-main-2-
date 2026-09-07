import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, openAPI } from "better-auth/plugins";
import { v7 } from "uuid";

import db from "@/db";
import { ac, customer, superAdmin } from "@/lib/permissions";

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
    debugLogs: false,
    camelCase: true,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 10, // 10 minutes
    },
  },
  advanced: {
    cookiePrefix: "diya-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: false,
    },
    // disable origin check in dev to allow requests without Origin header
    disableOriginCheck: process.env.NODE_ENV === "development",
    database: {
      generateId: (options) => {
        if (options.model === "user" || options.model === "users") {
          return false;
        }
        return v7();
      },
    },
  },
  user: {
    additionalFields: {
      phoneNumber: {
        type: "number",
        required: false,
        input: true,
      },
      isActive: {
        type: "boolean",
        required: false,
        defaultValue: true,
        input: false,
      },
    },
  },
  plugins: [
    nextCookies(),
    openAPI(),
    admin({
      ac,
      defaultRole: "customer",
      adminRoles: ["superAdmin"],
      roles: {
        superAdmin,
        customer,
      },
    }),
  ],
});
