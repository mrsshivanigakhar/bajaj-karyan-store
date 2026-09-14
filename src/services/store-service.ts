import { createClient } from '@/lib/supabase/server';
import { Category, Product, StoreSettings, Order } from '@/types/database';
import { fallbackCategories, fallbackProducts, fallbackStoreSettings } from '@/lib/mock-data';

export async function getStoreSettings(): Promise<StoreSettings> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('store_settings').select('*').limit(1).single();
    if (!error && data) {
      return data as StoreSettings;
    }
  } catch {
    // fallback
  }
  return fallbackStoreSettings;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (!error && data && data.length > 0) {
      return data as Category[];
    }
  } catch {
    // fallback
  }
  return fallbackCategories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (!error && data) {
      return data as Category;
    }
  } catch {
    // fallback
  }
  return fallbackCategories.find((c) => c.slug === slug) || null;
}

export async function getProducts(options?: {
  categorySlug?: string;
  featuredOnly?: boolean;
  search?: string;
  limit?: number;
}): Promise<Product[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('is_active', true);

    if (options?.featuredOnly) {
      query = query.eq('is_featured', true);
    }

    if (options?.search) {
      query = query.ilike('name', `%${options.search}%`);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      let filtered = data as Product[];
      if (options?.categorySlug) {
        filtered = filtered.filter(
          (p) => p.category && p.category.slug === options.categorySlug
        );
      }
      return filtered;
    }
  } catch {
    // fallback
  }

  // Fallback filtering
  let products = [...fallbackProducts];
  if (options?.featuredOnly) {
    products = products.filter((p) => p.is_featured);
  }
  if (options?.categorySlug) {
    const category = fallbackCategories.find((c) => c.slug === options.categorySlug);
    if (category) {
      products = products.filter((p) => p.category_id === category.id);
    }
  }
  if (options?.search) {
    const term = options.search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        (p.description && p.description.toLowerCase().includes(term))
    );
  }
  if (options?.limit) {
    products = products.slice(0, options.limit);
  }

  // Attach category object for fallback
  return products.map((p) => ({
    ...p,
    category: fallbackCategories.find((c) => c.id === p.category_id) || null,
  }));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('slug', slug)
      .single();

    if (!error && data) {
      return data as Product;
    }
  } catch {
    // fallback
  }

  const p = fallbackProducts.find((item) => item.slug === slug);
  if (!p) return null;
  return {
    ...p,
    category: fallbackCategories.find((c) => c.id === p.category_id) || null,
  };
}

export async function getOrdersForUser(userId: string): Promise<Order[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('customer_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      return data as Order[];
    }
  } catch {
    // ignore
  }
  return [];
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single();

    if (!error && data) {
      return data as Order;
    }
  } catch {
    // ignore
  }
  return null;
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('order_number', orderNumber)
      .single();

    if (!error && data) {
      return data as Order;
    }
  } catch {
    // ignore
  }
  return null;
}
