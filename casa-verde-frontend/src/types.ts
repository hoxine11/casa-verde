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

  variants?: ProductVariant[];
  options?: ProductOption[];

  crepeSteps?: CrepeStepItem[];
  crepeFormulas?: CrepeFormula[];

  selectedVariant?: ProductVariant | null;
  selectedOption?: ProductOption | null;
  selectedOptions?: ProductOption[]; // للسندويتش فقط

  selectedCrepeSteps?: CrepeStepItem[];
selectedFormula?: CrepeFormula | null;
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

  selectedVariant?: ProductVariant | null;
  selectedOption?: ProductOption | null;
}

export interface OrderItem {
  id: number;
  productId: string;
  name: string;
  price: number;
  quantity: number;

  variant_name?: string;
  option_name?: string;
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
  deliveryFee: string | number;
  total: number;
  date: string;
  status:
  | 'pending'
  | 'confirmed'
  | 'delivered'
  | 'cancelled';
  created_at: string;
}

export interface Settings {
  restaurantName: string;
  phone: string;
  address: string;
  deliveryFee: string;
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
export interface ProductVariant {
  id: number;
  product_id: number;
  name: string;
  price: number;
}

export interface ProductOption {
  id: number;
  product_id: number;
  name: string;
  price: number;
  option_group: string;
}
export interface CrepeStepItem {
  id?: number;
  step_number: number;
  name: string;
  price: number;
}

export interface CrepeFormula {
  id?: number;
  name: string;
  price: number;
}