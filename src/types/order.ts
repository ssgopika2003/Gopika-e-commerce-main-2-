export interface OrderItem {
  id: string;
  name: string;
  slug: string | null;
  image?: string | null;
  sku: string | null;
  selectedOptions: Record<string, string> | null;
  quantity: number;
  price: string;
  subtotal?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  fulfillmentStatus?: string | null;
  total: string;
  subtotal: string;
  tax?: string | null;
  shippingCost?: string | null;
  discount: string | null;
  createdAt: string | Date;
  items: OrderItem[];
  shippingAddress?: {
    fullName: string;
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    addressLine2?: string | null;
  } | null;
}
