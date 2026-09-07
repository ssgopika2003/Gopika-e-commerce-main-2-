export interface DelhiveryShipment {
  name: string;
  add: string;
  pin: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  order: string;
  payment_mode: "Prepaid" | "COD";
  return_add?: string;
  return_pin?: string;
  return_city?: string;
  return_state?: string;
  return_country?: string;
  return_phone?: string;
  weight: string;
  shipping_mode: "Surface" | "Express";
  products_desc: string;
  total_amount: string;
  cod_amount: string;
  quantity: string;
}

export interface DelhiveryPayload {
  pickup_location: { name: string };
  shipments: DelhiveryShipment[];
}

export interface DelhiveryResponse {
  success: boolean;
  status?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}
