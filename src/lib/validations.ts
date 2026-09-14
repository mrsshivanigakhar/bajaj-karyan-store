import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid 10-digit phone number').max(15),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  address: z.string().optional(),
  city: z.string().optional(),
  pincode: z.string().optional(),
});

export const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(10, 'Valid 10-digit mobile number is required'),
  email: z.string().email('Valid email address is required').optional().or(z.literal('')),
  deliveryAddress: z.string().min(5, 'Delivery address is required'),
  landmark: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().min(6, 'Valid 6-digit Pincode is required').max(6),
  customerNotes: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  slug: z.string().min(2, 'Slug is required'),
  category_id: z.string().uuid().nullable().optional(),
  description: z.string().optional().nullable(),
  image_url: z.string().url().optional().nullable().or(z.literal('')),
  price: z.number().nullable().optional(),
  sale_price: z.number().nullable().optional(),
  unit_type: z.string().min(1, 'Unit type is required'),
  unit_value: z.number().min(0.01, 'Unit value must be positive'),
  sku: z.string().optional().nullable(),
  stock_quantity: z.number().min(0, 'Stock cannot be negative'),
  is_available: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

export const categorySchema = z.object({
  name: z.string().min(2, 'Category name is required'),
  slug: z.string().min(2, 'Slug is required'),
  description: z.string().optional().nullable(),
  image_url: z.string().url().optional().nullable().or(z.literal('')),
  sort_order: z.number().default(0),
  is_active: z.boolean().default(true),
});

export const storeSettingsSchema = z.object({
  store_name: z.string().min(2, 'Store name is required'),
  phone: z.string().min(6, 'Phone is required'),
  email: z.string().email('Email is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().min(5, 'Pincode is required'),
  opening_hours: z.string().optional().nullable(),
  delivery_info: z.string().optional().nullable(),
  footer_text: z.string().optional().nullable(),
  low_stock_threshold: z.number().min(0),
  default_delivery_charge: z.number().min(0),
  order_prefix: z.string().min(2).max(10),
});
