CREATE TYPE "public"."discountType" AS ENUM('percentage', 'fixed_amount');--> statement-breakpoint
CREATE TYPE "public"."fulfillmentStatus" AS ENUM('unfulfilled', 'partially_fulfilled', 'fulfilled', 'returned', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."mediaRefType" AS ENUM('product', 'variant', 'review', 'category', 'collection');--> statement-breakpoint
CREATE TYPE "public"."mediaType" AS ENUM('image', 'video');--> statement-breakpoint
CREATE TYPE "public"."orderStatus" AS ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."paymentStatus" AS ENUM('pending', 'authorized', 'paid', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('customer', 'admin', 'manager');--> statement-breakpoint
CREATE TYPE "public"."shipmentStatus" AS ENUM('pending', 'ordered', 'shipped', 'out_for_delivery', 'delivered', 'failed');--> statement-breakpoint
CREATE TABLE "address" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"userId" uuid NOT NULL,
	"fullName" varchar(255) NOT NULL,
	"phone" varchar(20),
	"addressLine1" varchar(500) NOT NULL,
	"addressLine2" varchar(500),
	"city" varchar(100) NOT NULL,
	"state" varchar(100) NOT NULL,
	"postalCode" varchar(20) NOT NULL,
	"country" varchar(100) NOT NULL,
	"isDefault" boolean DEFAULT false NOT NULL,
	"label" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "cart" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"userId" uuid,
	"sessionId" varchar(255),
	"expiresAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "cartItem" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"cartId" uuid NOT NULL,
	"productId" uuid NOT NULL,
	"variantId" uuid,
	"quantity" integer NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"snapshot" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "category" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"parentId" uuid,
	"position" integer DEFAULT 0,
	"isActive" boolean DEFAULT true,
	CONSTRAINT "category_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "collection" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"image" varchar(1000),
	"position" integer DEFAULT 0,
	"isActive" boolean DEFAULT true,
	CONSTRAINT "collection_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "coupon" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"code" varchar(50) NOT NULL,
	"description" text,
	"discountType" "discountType" NOT NULL,
	"discountValue" numeric(12, 2) NOT NULL,
	"minPurchaseAmount" numeric(12, 2) DEFAULT '0.00',
	"maxDiscountAmount" numeric(12, 2),
	"usageLimit" integer,
	"usageCount" integer DEFAULT 0,
	"startDate" timestamp,
	"endDate" timestamp,
	"isActive" boolean DEFAULT true,
	CONSTRAINT "coupon_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "couponUsage" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"couponId" uuid NOT NULL,
	"userId" uuid,
	"orderId" uuid NOT NULL,
	"discountAmount" numeric(12, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"url" varchar(1000) NOT NULL,
	"thumbnailUrl" varchar(1000),
	"altText" varchar(255),
	"mediaType" "mediaType" DEFAULT 'image' NOT NULL,
	"refId" uuid NOT NULL,
	"refType" "mediaRefType" NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"orderNumber" varchar(50) NOT NULL,
	"userId" uuid,
	"guestOrderToken" uuid,
	"status" "orderStatus" DEFAULT 'pending' NOT NULL,
	"paymentStatus" "paymentStatus" DEFAULT 'pending' NOT NULL,
	"total" numeric(12, 2) NOT NULL,
	"fulfillmentStatus" "fulfillmentStatus" DEFAULT 'unfulfilled',
	"subtotal" numeric(12, 2) NOT NULL,
	"tax" numeric(12, 2) DEFAULT '0.00',
	"shippingCost" numeric(12, 2) DEFAULT '0.00',
	"discount" numeric(12, 2) DEFAULT '0.00',
	CONSTRAINT "order_orderNumber_unique" UNIQUE("orderNumber")
);
--> statement-breakpoint
CREATE TABLE "orderItem" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"orderId" uuid NOT NULL,
	"productId" uuid NOT NULL,
	"variantId" uuid,
	"quantity" integer NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"snapshot" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orderShippingAddress" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"orderId" uuid NOT NULL,
	"fullName" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"addressLine1" varchar(500) NOT NULL,
	"addressLine2" varchar(500),
	"city" varchar(100) NOT NULL,
	"state" varchar(100) NOT NULL,
	"postalCode" varchar(20) NOT NULL,
	"country" varchar(100) NOT NULL,
	CONSTRAINT "orderShippingAddress_orderId_unique" UNIQUE("orderId")
);
--> statement-breakpoint
CREATE TABLE "payment" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"orderId" uuid NOT NULL,
	"userId" uuid,
	"gateway" varchar(50) NOT NULL,
	"gatewayTransactionId" varchar(255),
	"amount" numeric(12, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'INR',
	"status" "paymentStatus" DEFAULT 'pending',
	"paymentMethod" varchar(50),
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "paymentAttempt" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"orderId" uuid NOT NULL,
	"txnid" varchar(255) NOT NULL,
	"gateway" varchar(50) DEFAULT 'payu' NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"status" varchar(50) DEFAULT 'pending',
	"gatewayTxnId" varchar(255),
	"mode" varchar(50),
	"error" text,
	"metaData" jsonb,
	CONSTRAINT "paymentAttempt_txnid_unique" UNIQUE("txnid")
);
--> statement-breakpoint
CREATE TABLE "product" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"additionalInfoSections" jsonb,
	"productOptions" jsonb,
	"discount" jsonb,
	"basePrice" numeric(12, 2) NOT NULL,
	"salePrice" numeric(12, 2),
	"currency" varchar(3) DEFAULT 'INR',
	"sku" varchar(100),
	"brand" varchar(100),
	"ribbon" varchar(50),
	"isActive" boolean DEFAULT true,
	"isFeatured" boolean DEFAULT false,
	"categoryId" uuid,
	CONSTRAINT "product_slug_unique" UNIQUE("slug"),
	CONSTRAINT "product_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "productCollections" (
	"productId" uuid NOT NULL,
	"collectionId" uuid NOT NULL,
	"position" integer DEFAULT 0,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "productVariant" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"productId" uuid NOT NULL,
	"costPrice" numeric(12, 2) DEFAULT '0.00',
	"trackInventory" boolean DEFAULT true NOT NULL,
	"sku" varchar(100) NOT NULL,
	"price" numeric(12, 2),
	"stockQuantity" integer DEFAULT 0 NOT NULL,
	"optionValues" jsonb NOT NULL,
	CONSTRAINT "productVariant_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "shipment" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"orderId" uuid NOT NULL,
	"addressId" uuid,
	"carrier" varchar(100),
	"trackingNumber" varchar(255),
	"trackingUrl" varchar(1000),
	"status" "shipmentStatus" DEFAULT 'pending',
	"shippedAt" timestamp,
	"deliveredAt" timestamp,
	"notes" text,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" uuid NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp,
	"refreshTokenExpiresAt" timestamp,
	"scope" text,
	"password" text,
	CONSTRAINT "account_accountId_unique" UNIQUE("accountId")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"userId" uuid NOT NULL,
	"impersonatedBy" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean DEFAULT false NOT NULL,
	"phoneNumber" bigint,
	"image" text,
	"role" text,
	"banned" boolean DEFAULT false,
	"banReason" text,
	"banExpires" timestamp,
	"isActive" boolean DEFAULT true,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_phoneNumber_unique" UNIQUE("phoneNumber")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "address" ADD CONSTRAINT "address_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cartItem" ADD CONSTRAINT "cartItem_cartId_cart_id_fk" FOREIGN KEY ("cartId") REFERENCES "public"."cart"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cartItem" ADD CONSTRAINT "cartItem_productId_product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cartItem" ADD CONSTRAINT "cartItem_variantId_productVariant_id_fk" FOREIGN KEY ("variantId") REFERENCES "public"."productVariant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category" ADD CONSTRAINT "category_parentId_category_id_fk" FOREIGN KEY ("parentId") REFERENCES "public"."category"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "couponUsage" ADD CONSTRAINT "couponUsage_couponId_coupon_id_fk" FOREIGN KEY ("couponId") REFERENCES "public"."coupon"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "couponUsage" ADD CONSTRAINT "couponUsage_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "couponUsage" ADD CONSTRAINT "couponUsage_orderId_order_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orderItem" ADD CONSTRAINT "orderItem_orderId_order_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orderItem" ADD CONSTRAINT "orderItem_productId_product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orderItem" ADD CONSTRAINT "orderItem_variantId_productVariant_id_fk" FOREIGN KEY ("variantId") REFERENCES "public"."productVariant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orderShippingAddress" ADD CONSTRAINT "orderShippingAddress_orderId_order_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_orderId_order_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paymentAttempt" ADD CONSTRAINT "paymentAttempt_orderId_order_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_categoryId_category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."category"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productCollections" ADD CONSTRAINT "productCollections_productId_product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productCollections" ADD CONSTRAINT "productCollections_collectionId_collection_id_fk" FOREIGN KEY ("collectionId") REFERENCES "public"."collection"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productVariant" ADD CONSTRAINT "productVariant_productId_product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipment" ADD CONSTRAINT "shipment_orderId_order_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipment" ADD CONSTRAINT "shipment_addressId_address_id_fk" FOREIGN KEY ("addressId") REFERENCES "public"."address"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "refIdIdx" ON "media" USING btree ("refId");--> statement-breakpoint
CREATE INDEX "refTypeIdx" ON "media" USING btree ("refType");--> statement-breakpoint
CREATE INDEX "orderGuestTokenIdx" ON "order" USING btree ("guestOrderToken");--> statement-breakpoint
CREATE INDEX "orderUserIdx" ON "order" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "orderShippingAddressOrderIdx" ON "orderShippingAddress" USING btree ("orderId");--> statement-breakpoint
CREATE INDEX "product_collection_idx" ON "productCollections" USING btree ("productId","collectionId");--> statement-breakpoint
CREATE INDEX "accountUserIdIdx" ON "account" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "sessionUserIdIdx" ON "session" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "verificationIdentifierIdx" ON "verification" USING btree ("identifier");