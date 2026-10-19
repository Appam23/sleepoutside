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