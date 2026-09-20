export type UserRole = 'customer' | 'admin';

export type UnitType =
  | 'piece'
  | 'packet'
  | 'box'
  | 'kg'
  | 'gram'
  | 'litre'
  | 'ml'
  | 'dozen'
  | 'bundle'
  | 'custom';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'paid';

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  role: UserRole;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  parent_id?: string | null;
  parent_slug?: string | null;
  parent?: Category | null;
  subcategories?: Category[];
}

export interface Product {
  id: string;
  category_id: string | null;
  category?: Category | null;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  price: number | null; // null represents "Price on Request"
  sale_price: number | null;
  unit_type: UnitType;
  unit_value: number;
  sku: string | null;
  stock_quantity: number;
  is_available: boolean;
  is_featured: boolean;
  is_active: boolean;
  dietary_preference?: 'veg' | 'non-veg' | 'egg' | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string | null;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  delivery_charge: number;
  estimated_total: number;
  final_total: number;
  payment_status: PaymentStatus;
  payment_method: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  landmark: string | null;
  city: string;
  state: string;
  pincode: string;
  customer_notes: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  unit_type: UnitType | string;
  unit_value: number;
  quantity: number;
  requested_weight: string | null;
  unit_price: number | null; // null if price on request
  line_total: number | null;
  price_confirmed: boolean;
  customer_notes: string | null;
  created_at: string;
}

export interface StoreSettings {
  id: string;
  store_name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  opening_hours: string | null;
  delivery_info: string | null;
  footer_text: string | null;
  low_stock_threshold: number;
  default_delivery_charge: number;
  order_prefix: string;
  updated_at: string;
}

// Shopping list item in customer's local list
export interface ShoppingListItem {
  productId: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  price: number | null; // null means Price on Request
  unitType: UnitType | string;
  unitValue: number;
  quantity: number;
  requestedWeight?: string;
  customerNotes?: string;
}
