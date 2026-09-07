export interface HomeProduct {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  visible: boolean;
  description?: string;
  media?: {
    items: MediaItem[];
    mainMedia?: MediaItem;
  };
  stock?: Stock;
  priceData?: PriceData;
  additionalInfoSections?: AdditionalInfoSection[];
  ribbons?: Array<{ text: string }>;
  ribbon?: string;
  productOptions?: ProductOption[];
  discount?: Discount;
  variants?: VariantWithDetails[];
  lastUpdated?: string;
  brand?: string;
}

export interface MediaItem {
  _id: string;
  mediaType?: "image" | "video";
  title?: string;
  image?: Image;
  video?: Video;
  thumbnail?: Image;
}

export interface Image {
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface Video {
  files?: VideoFile[];
  stillFrameMediaId?: string;
}

export interface VideoFile {
  url: string;
  format?: string;
  altText?: string;
}

export interface PriceData {
  price: number;
  discountedPrice: number;
  currency: string;
}

export interface ProductOption {
  name: string;
  optionType: OptionType;
  choices: ProductOptionChoice[];
}

export interface ProductOptionChoice {
  description: string;
  value: string;
  inStock: boolean;
  visible: boolean;
  media?: {
    mainMedia?: MediaItem;
    items: MediaItem[];
  };
}

export interface Stock {
  trackInventory?: boolean;
  trackQuantity?: boolean;
  inStock: boolean;
  quantity?: number;
  inventoryStatus?: "IN_STOCK" | "OUT_OF_STOCK" | "PARTIALLY_OUT_OF_STOCK";
}

export interface AdditionalInfoSection {
  title: string;
  description: string;
}

export interface Discount {
  type: "PERCENT" | "AMOUNT" | "NONE";
  value: number;
}

export enum OptionType {
  color = "color",
  drop_down = "drop_down",
}

export interface Variant {
  _id: string;
  choices: Record<string, string>;
  stock?: Stock;
  priceData?: PriceData;
  variant?: {
    priceData?: PriceData;
    convertedPriceData?: PriceData;
    weight?: number;
    sku?: string;
    visible?: boolean;
  };
}

export interface VariantWithDetails {
  _id: string;
  choices: Record<string, string>;
  variant: {
    priceData: PriceData;
    convertedPriceData: PriceData;
    weight?: number;
    sku?: string;
    visible: boolean;
  };
  stock: {
    trackQuantity: boolean;
    quantity?: number;
    inStock: boolean;
  };
}

export interface LineItem {
  _id: string;
  productId: string;
  name: string;
  productName?: {
    original?: string;
    translated?: string;
  };
  image?: string;
  mediaItem?: {
    url: string;
    altText?: string;
  };
  quantity: number;
  price?: {
    amount: string;
  };
  fullPrice?: {
    amount: string;
  };
  descriptionLines?: Array<{
    name?: {
      original?: string;
      translated?: string;
    };
    colorInfo?: {
      original?: string;
      translated?: string;
    };
    plainText?: {
      original?: string;
      translated?: string;
    };
  }>;
  url?: string;
  availability?: {
    quantityAvailable?: number;
    status?: string;
  };
}

export interface Cart {
  _id: string;
  lineItems: LineItem[];
  subtotal?: {
    amount: string;
  };
}
