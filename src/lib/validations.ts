import { z } from "zod";

const requiredString = z.string().trim().min(1, "This field is required");

export const signUpSchema = z.object({
  email: requiredString.email("Invalid email address"),
  name: requiredString.regex(/^[a-zA-Z ]+$/, "Only letters allowed"),
  phoneNumber: requiredString.min(10, ""),
  password: requiredString.min(8, "Must be at least 8 characters"),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  email: requiredString,
  password: requiredString,
});

export type LoginValues = z.infer<typeof loginSchema>;

export const createCategorySchema = z.object({
  name: requiredString.min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Invalid slug format"),
  description: z.string().optional(),
  parentId: z.string().uuid().optional().nullable(),
  position: z.number().int().optional(),
  isActive: z.boolean().optional(),
});
export type CategoryValues = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = createCategorySchema.partial();

export type UpdateCategoryValues = z.infer<typeof updateCategorySchema>;

export const addressSchema = z.object({
  fullName: requiredString
    .min(2, "Full name must be at least 2 characters")
    .max(255, "Full name is too long"),

  phone: requiredString.min(10, "Phone number is required"),

  addressLine1: requiredString
    .min(5, "Address line 1 is required")
    .max(500, "Address line 1 is too long"),

  addressLine2: z.string().max(500, "Address line 2 is too long").optional(),

  city: requiredString
    .min(2, "City is required")
    .max(100, "City name is too long"),

  state: requiredString
    .min(2, "State is required")
    .max(100, "State name is too long"),

  postalCode: requiredString.regex(/^[1-9][0-9]{5}$/, "Invalid PIN code"),

  country: requiredString
    .min(2, "Country is required")
    .max(100, "Country name is too long")
    .default("India"),

  isDefault: z.boolean().optional(),

  label: z.string().max(50, "Label is too long").optional(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;

export const cartItemSchema = z.object({
  cartItemId: z.string(),
  variantId: z.string().optional(),
  product: z
    .object({
      _id: z.string(),
      priceData: z.object({
        price: z.number(),
        discountedPrice: z.number(),
      }),
    })
    .passthrough(),
  quantity: z.number().int().min(1),
  selectedOptions: z.record(z.string(), z.string()).optional(),
});

export const cartSyncSchema = z.object({
  localItems: z.array(cartItemSchema),
});

export const cartRefreshSchema = z.object({
  items: z.array(cartItemSchema),
});

export const addToCartSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().optional().nullable(),
  quantity: z.number().int().min(1),
});

export const updateCartItemSchema = z.object({
  itemId: z.string().uuid(),
  newQuantity: z.number().int().min(1),
});

export type UpdateCartItemQuantityValues = z.infer<typeof updateCartItemSchema>;

export const applyCouponSchema = z.object({
  code: requiredString
    .min(1, "Please enter a code")
    .transform((val) => val.toUpperCase()),
  subtotal: z.number().positive("Subtotal is required for validation"),
});

// guest checkout

export const guestShippingSchema = z.object({
  fullName: requiredString.min(2, "Full name must be at least 2 characters"),
  email: requiredString.email("Invalid email address"),
  phone: requiredString.min(10, "Phone number must be at least 10 digits"),
  addressLine1: requiredString.min(5, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  city: requiredString.min(2, "City is required"),
  state: requiredString.min(2, "State is required"),
  postalCode: requiredString.regex(/^[1-9][0-9]{5}$/, "Invalid PIN code"),
  country: requiredString,
});

export type GuestShippingValues = z.infer<typeof guestShippingSchema>;

export const checkoutInitiateSchema = z.object({
  shippingDetails: guestShippingSchema,
  cartId: z.string().uuid().optional(),
  isDirect: z.boolean().optional(),
  variantId: z.string().uuid().optional(),
  quantity: z.number().int().min(1).optional(),
  totalAmount: z.number().optional(),
  discount: z.number().optional(),
  couponCode: z.string().optional(),
});

export type CheckoutInitiateValues = z.infer<typeof checkoutInitiateSchema>;

export const payuCallbackSchema = z.object({
  mihpayid: z.string().optional(),
  mode: z.string().optional(),
  status: z.string(),
  unmappedstatus: z.string().optional(),
  key: z.string(),
  txnid: z.string(),
  amount: z.string(),
  discount: z.string().optional(),
  net_amount_debit: z.string().optional(),
  addedon: z.string().optional(),
  productinfo: z.string(),
  firstname: z.string(),
  lastname: z.string().optional(),
  address1: z.string().optional(),
  address2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipcode: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  udf1: z.string().optional(),
  udf2: z.string().optional(),
  udf3: z.string().optional(),
  udf4: z.string().optional(),
  udf5: z.string().optional(),
  hash: z.string(),
  field1: z.string().optional(),
  field2: z.string().optional(),
  field3: z.string().optional(),
  field4: z.string().optional(),
  field5: z.string().optional(),
  field6: z.string().optional(),
  field7: z.string().optional(),
  field8: z.string().optional(),
  field9: z.string().optional(),
  payment_source: z.string().optional(),
  PG_TYPE: z.string().optional(),
  bank_ref_num: z.string().optional(),
  bankcode: z.string().optional(),
  error: z.string().optional(),
  error_Message: z.string().optional(),
});

export type PayUCallbackValues = z.infer<typeof payuCallbackSchema>;
