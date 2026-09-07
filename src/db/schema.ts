import {
  boolean,
  decimal,
  foreignKey,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { baseSchema, user } from "./auth-schema";

// ENUMS
export const roleEnum = pgEnum("role", ["customer", "admin", "manager"]);
export const orderStatusEnum = pgEnum("orderStatus", [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);
export const paymentStatusEnum = pgEnum("paymentStatus", [
  "pending",
  "authorized",
  "paid",
  "failed",
  "refunded",
]);
export const mediaTypeEnum = pgEnum("mediaType", ["image", "video"]);
export const mediaRefTypeEnum = pgEnum("mediaRefType", [
  "product",
  "variant",
  "review",
  "category",
  "collection",
]);
export const discountTypeEnum = pgEnum("discountType", [
  "percentage",
  "fixed_amount",
]);
export const shipmentStatusEnum = pgEnum("shipmentStatus", [
  "pending",
  "ordered",
  "shipped",
  "out_for_delivery",
  "delivered",
  "failed",
]);
export const fulfillmentStatusEnum = pgEnum("fulfillmentStatus", [
  "unfulfilled",
  "partially_fulfilled",
  "fulfilled",
  "returned",
  "cancelled",
]);

// USER & ADDRESS
export const address = pgTable("address", {
  ...baseSchema,
  userId: uuid("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  addressLine1: varchar("addressLine1", { length: 500 }).notNull(),
  addressLine2: varchar("addressLine2", { length: 500 }),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  postalCode: varchar("postalCode", { length: 20 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  isDefault: boolean("isDefault").default(false).notNull(),
  label: varchar("label", { length: 50 }),
});

// MEDIA
export const media = pgTable(
  "media",
  {
    ...baseSchema,
    url: varchar("url", { length: 1000 }).notNull(),
    thumbnailUrl: varchar("thumbnailUrl", { length: 1000 }),
    altText: varchar("altText", { length: 255 }),
    mediaType: mediaTypeEnum("mediaType").default("image").notNull(),
    refId: uuid("refId").notNull(),
    refType: mediaRefTypeEnum("refType").notNull(),
    position: integer("position").default(0).notNull(),
  },
  (table) => ({
    refIdx: index("refIdIdx").on(table.refId),
    refTypeIdx: index("refTypeIdx").on(table.refType),
  })
);

// CATALOG & COLLECTIONS
export const category = pgTable(
  "category",
  {
    ...baseSchema,
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    parentId: uuid("parentId"),
    position: integer("position").default(0),
    isActive: boolean("isActive").default(true),
  },
  (table) => ({
    parentFk: foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
    }).onDelete("set null"),
  })
);

export const collection = pgTable("collection", {
  ...baseSchema,
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  image: varchar("image", { length: 1000 }),
  position: integer("position").default(0),
  isActive: boolean("isActive").default(true),
});

export const product = pgTable("product", {
  ...baseSchema,
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  additionalInfoSections: jsonb("additionalInfoSections").$type<
    { title: string; description: string }[]
  >(),
  productOptions: jsonb("productOptions").$type<
    {
      name: string;
      optionType: string;
      choices: {
        value: string;
        description: string;
        inStock: boolean;
        visible: boolean;
      }[];
    }[]
  >(),
  discount: jsonb("discount").$type<{
    type: "percent" | "amount" | "none";
    value: number;
  }>(),
  basePrice: decimal("basePrice", { precision: 12, scale: 2 }).notNull(),
  salePrice: decimal("salePrice", { precision: 12, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default("INR"),
  sku: varchar("sku", { length: 100 }).unique(),
  brand: varchar("brand", { length: 100 }),
  ribbon: varchar("ribbon", { length: 50 }),
  isActive: boolean("isActive").default(true),
  isFeatured: boolean("isFeatured").default(false),
  categoryId: uuid("categoryId").references(() => category.id, {
    onDelete: "set null",
  }),
});

export const productCollections = pgTable(
  "productCollections",
  {
    productId: uuid("productId")
      .notNull()
      .references(() => product.id, { onDelete: "cascade" }),
    collectionId: uuid("collectionId")
      .notNull()
      .references(() => collection.id, { onDelete: "cascade" }),
    position: integer("position").default(0),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (t) => ({
    pk: index("product_collection_idx").on(t.productId, t.collectionId),
  })
);

export const productVariant = pgTable("productVariant", {
  ...baseSchema,
  productId: uuid("productId")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
  costPrice: decimal("costPrice", { precision: 12, scale: 2 }).default("0.00"),
  trackInventory: boolean("trackInventory").default(true).notNull(),
  sku: varchar("sku", { length: 100 }).notNull().unique(),
  price: decimal("price", { precision: 12, scale: 2 }),
  stockQuantity: integer("stockQuantity").default(0).notNull(),
  optionValues: jsonb("optionValues").$type<Record<string, string>>().notNull(),
});

// cart
export const cart = pgTable("cart", {
  ...baseSchema,
  userId: uuid("userId").references(() => user.id, { onDelete: "cascade" }),
  sessionId: varchar("sessionId", { length: 255 }),
  expiresAt: timestamp("expiresAt"),
});

export const cartItem = pgTable("cartItem", {
  ...baseSchema,
  cartId: uuid("cartId")
    .notNull()
    .references(() => cart.id, { onDelete: "cascade" }),
  productId: uuid("productId")
    .notNull()
    .references(() => product.id),
  variantId: uuid("variantId").references(() => productVariant.id),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  snapshot: jsonb("snapshot").notNull(),
});

// orders
export const order = pgTable(
  "order",
  {
    ...baseSchema,
    orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
    userId: uuid("userId").references(() => user.id, { onDelete: "set null" }),
    // used to look up guest orders via cookie
    guestOrderToken: uuid("guestOrderToken"),
    status: orderStatusEnum("status").default("pending").notNull(),
    paymentStatus: paymentStatusEnum("paymentStatus")
      .default("pending")
      .notNull(),
    total: decimal("total", { precision: 12, scale: 2 }).notNull(),
    fulfillmentStatus:
      fulfillmentStatusEnum("fulfillmentStatus").default("unfulfilled"),
    subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
    tax: decimal("tax", { precision: 12, scale: 2 }).default("0.00"),
    shippingCost: decimal("shippingCost", { precision: 12, scale: 2 }).default(
      "0.00"
    ),
    discount: decimal("discount", { precision: 12, scale: 2 }).default("0.00"),
  },
  (t) => ({
    guestTokenIdx: index("orderGuestTokenIdx").on(t.guestOrderToken),
    userIdx: index("orderUserIdx").on(t.userId),
  })
);

export const orderItem = pgTable("orderItem", {
  ...baseSchema,
  orderId: uuid("orderId")
    .notNull()
    .references(() => order.id, { onDelete: "cascade" }),
  productId: uuid("productId")
    .notNull()
    .references(() => product.id),
  variantId: uuid("variantId").references(() => productVariant.id),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  snapshot: jsonb("snapshot").notNull(),
});

// per-order shipping snapshot (works for guests + logged-in users)
export const orderShippingAddress = pgTable(
  "orderShippingAddress",
  {
    ...baseSchema,
    orderId: uuid("orderId")
      .notNull()
      .unique()
      .references(() => order.id, { onDelete: "cascade" }),
    fullName: varchar("fullName", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 20 }).notNull(),
    addressLine1: varchar("addressLine1", { length: 500 }).notNull(),
    addressLine2: varchar("addressLine2", { length: 500 }),
    city: varchar("city", { length: 100 }).notNull(),
    state: varchar("state", { length: 100 }).notNull(),
    postalCode: varchar("postalCode", { length: 20 }).notNull(),
    country: varchar("country", { length: 100 }).notNull(),
  },
  (t) => ({
    orderIdx: index("orderShippingAddressOrderIdx").on(t.orderId),
  })
);

export const payment = pgTable("payment", {
  ...baseSchema,
  orderId: uuid("orderId")
    .notNull()
    .references(() => order.id, { onDelete: "cascade" }),
  userId: uuid("userId").references(() => user.id, { onDelete: "set null" }),
  gateway: varchar("gateway", { length: 50 }).notNull(),
  gatewayTransactionId: varchar("gatewayTransactionId", { length: 255 }),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("INR"),
  status: paymentStatusEnum("status").default("pending"),
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  metadata: jsonb("metadata"),
});

export const shipment = pgTable("shipment", {
  ...baseSchema,
  orderId: uuid("orderId")
    .notNull()
    .references(() => order.id, { onDelete: "cascade" }),
  addressId: uuid("addressId").references(() => address.id, {
    onDelete: "set null",
  }),
  carrier: varchar("carrier", { length: 100 }),
  trackingNumber: varchar("trackingNumber", { length: 255 }),
  trackingUrl: varchar("trackingUrl", { length: 1000 }),
  status: shipmentStatusEnum("status").default("pending"),
  shippedAt: timestamp("shippedAt"),
  deliveredAt: timestamp("deliveredAt"),
  notes: text("notes"),
  metadata: jsonb("metadata"),
});
export const coupon = pgTable("coupon", {
  ...baseSchema,
  code: varchar("code", { length: 50 }).notNull().unique(),
  description: text("description"),
  discountType: discountTypeEnum("discountType").notNull(),
  discountValue: decimal("discountValue", {
    precision: 12,
    scale: 2,
  }).notNull(),
  minPurchaseAmount: decimal("minPurchaseAmount", {
    precision: 12,
    scale: 2,
  }).default("0.00"),
  maxDiscountAmount: decimal("maxDiscountAmount", { precision: 12, scale: 2 }),
  usageLimit: integer("usageLimit"),
  usageCount: integer("usageCount").default(0),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  isActive: boolean("isActive").default(true),
});

export const couponUsage = pgTable("couponUsage", {
  ...baseSchema,
  couponId: uuid("couponId")
    .notNull()
    .references(() => coupon.id, { onDelete: "cascade" }),
  userId: uuid("userId").references(() => user.id, { onDelete: "cascade" }),
  orderId: uuid("orderId")
    .notNull()
    .references(() => order.id, { onDelete: "cascade" }),
  discountAmount: decimal("discountAmount", {
    precision: 12,
    scale: 2,
  }).notNull(),
});
export const paymentAttempt = pgTable("paymentAttempt", {
  ...baseSchema,
  orderId: uuid("orderId")
    .notNull()
    .references(() => order.id, { onDelete: "cascade" }),
  txnId: varchar("txnid", { length: 255 }).notNull().unique(),
  gateway: varchar("gateway", { length: 50 }).notNull().default("payu"),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).default("pending"),
  gatewayTxnId: varchar("gatewayTxnId", { length: 255 }),
  mode: varchar("mode", { length: 50 }),
  error: text("error"),
  metaData: jsonb("metaData"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
