export interface CheckoutItem {
  itemId: string;
  productId: string;
  variantId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  selectedOptions: Record<string, string>;
}

export interface DirectCheckoutSession {
  isDirectBuy: boolean;
  items: CheckoutItem[];
  subtotal: number;
}

export interface CouponApplyResponse {
  success: boolean;
  couponId: string;
  code: string;
  discountAmount: number;
  discountType: "percentage" | "fixed_amount";
  message?: string;
}

export interface PayUInitiateRequest {
  // Mandatory Fields
  key: string;
  txnid: string;
  amount: string;
  productInfo: string;
  firstName: string;
  email: string;
  phone: string;
  surl: string;
  furl: string;
  hash: string;

  // Optional Core Fields
  lastName?: string;
  curl?: string; // payment cancile url

  // Billing Address (Optional but recommended for fraud prevention)
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;

  // Payment Customization
  enforced_payment?: string; // e.g. "creditcard|debitcard"
  drop_category?: string; // e.g. "CC"

  // Custom Note Display
  custom_note?: string;
  note_category?: string; // e.g. "CC, NB"

  // User Defined Fields
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
}

export interface CheckoutVerifyResponse {
  success: boolean;
  orderId: string;
  orderNumber: string;
  guestOrderToken?: string;
}
