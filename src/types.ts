/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: number;
  name: string;
  description: string;
  image_url: string;
  price: number;
  is_active: boolean;
  category: string;
  category_id: number;
}

export interface Category {
  id: number;
  name: string;
  image_url?: string;
  is_active?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: number;
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  customerName: string;
  phone: string;
  address: string;
  neighborhood: string;
  comment?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  date: string;
  status:
  | 'pending'
  | 'confirmed'
  | 'delivered'
  | 'cancelled';
}

export interface Settings {
  restaurantName: string;
  phone: string;
  address: string;
  deliveryFee: number;
  facebook: string;
  instagram: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  ordersCount: number;
  totalSpent: number;
}
