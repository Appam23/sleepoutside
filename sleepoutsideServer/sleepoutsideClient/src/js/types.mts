export interface Color {
  colorCode: string;
  colorName: string;
}

export interface Brand {
  id: string;
  /** Optional - some entries may not include a logo */
  logoSrc?: string;
  name: string;
}

export interface Product {
  id: string;
  nameWithoutBrand: string;
  name: string;
  images: {
    primarySmall: string;
    primaryMedium: string;
    primaryLarge: string;
    primaryExtraLarge: string;
    extraImages: {
      title: string;
      src: string;
    }[];
  };
  sizesAvailable: Record<string, unknown>;
  colors: Color[];
  descriptionHtmlSimple: string;
  suggestedRetailPrice: number;
  brand: Brand;
  listPrice: number;
  finalPrice: number;
  /** Optional flags present on some products */
  isFamousBrand?: boolean;
}
export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  priceAtAdd: number;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  address?: Address;
  cart: CartItem[];
  createdAt: Date;
  modifiedAt: Date;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  createdAt: Date;
  modifiedAt: Date;
}

export interface Review {
  _id: string;
  productId: string;
  userId: string;
  rating: number;
  title?: string;
  comment: string;
  createdAt: Date;
  modifiedAt: Date;
}

export type AlertType =
  | "warning"
  | "info"
  | "promotion";

export type AlertStatus =
  | "active"
  | "inactive";

export interface Alert {
  _id: string;
  title: string;
  message: string;
  type: AlertType;
  status: AlertStatus;
  condition?: Record<string, unknown>;
  createdAt: Date;
  modifiedAt: Date;
}