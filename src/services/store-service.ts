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

export interface PaginatedProductsResult {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function getPaginatedProducts(options?: {
  categorySlug?: string;
  featuredOnly?: boolean;
  search?: string;
  priceType?: string;
  page?: number;
  pageSize?: number;
}): Promise<PaginatedProductsResult> {
  const page = Math.max(1, options?.page || 1);
  const pageSize = Math.max(1, options?.pageSize || 20);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  try {
    const supabase = await createClient();

    let categoryIds: string[] | null = null;
    if (options?.categorySlug) {
      const { data: matchedCats } = await supabase
        .from('categories')
        .select('id, slug, description')
        .or(`slug.eq.${options.categorySlug},slug.ilike.${options.categorySlug}--%,description.ilike.%[Parent: ${options.categorySlug}]%`);

      if (matchedCats && matchedCats.length > 0) {
        categoryIds = matchedCats.map((c) => c.id);
      } else {
        const { data: singleCat } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', options.categorySlug)
          .single();
        if (singleCat) {
          categoryIds = [singleCat.id];
        } else {
          categoryIds = [];
        }
      }
    }

    let query = supabase
      .from('products')
      .select('*, category:categories(*)', { count: 'exact' })
      .eq('is_active', true);

    if (categoryIds !== null) {
      if (categoryIds.length === 0) {
        return { products: [], total: 0, page, pageSize, totalPages: 0 };
      }
      query = query.in('category_id', categoryIds);
    }

    if (options?.featuredOnly) {
      query = query.eq('is_featured', true);
    }

    if (options?.priceType === 'fixed') {
      query = query.not('price', 'is', null);
    } else if (options?.priceType === 'request') {
      query = query.is('price', null);
    }

    if (options?.search) {
      query = query.ilike('name', `%${options.search}%`);
    }

    query = query
      .order('created_at', { ascending: false })
      .range(from, to);

    const { data, count, error } = await query;

    if (!error && data) {
      const total = count || 0;
      return {
        products: data as Product[],
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    }
  } catch (err) {
    console.error('getPaginatedProducts error:', err);
  }

  // Fallback
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
  if (options?.priceType === 'fixed') {
    products = products.filter((p) => p.price !== null);
  } else if (options?.priceType === 'request') {
    products = products.filter((p) => p.price === null);
  }
  if (options?.search) {
    const term = options.search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        (p.description && p.description.toLowerCase().includes(term))
    );
  }

  const total = products.length;
  const pagedItems = products.slice(from, to + 1).map((p) => ({
    ...p,
    category: fallbackCategories.find((c) => c.id === p.category_id) || null,
  }));

  return {
    products: pagedItems,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getRelatedProducts(
  currentProductId: string,
  categorySlug?: string,
  limit: number = 18
): Promise<Product[]> {
  try {
    const supabase = await createClient();

    let categoryIds: string[] | null = null;
    if (categorySlug) {
      const baseMainSlug = categorySlug.includes('--') ? categorySlug.split('--')[0] : categorySlug;
      const { data: matchedCats } = await supabase
        .from('categories')
        .select('id')
        .or(`slug.eq.${categorySlug},slug.eq.${baseMainSlug},slug.ilike.${baseMainSlug}--%`);

      if (matchedCats && matchedCats.length > 0) {
        categoryIds = matchedCats.map((c) => c.id);
      }
    }

    let query = supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('is_active', true)
      .neq('id', currentProductId);

    if (categoryIds && categoryIds.length > 0) {
      query = query.in('category_id', categoryIds);
    }

    query = query.limit(limit);

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data as Product[];
    }
  } catch (err) {
    console.error('getRelatedProducts error:', err);
  }

  return fallbackProducts
    .filter((p) => p.id !== currentProductId)
    .slice(0, limit)
    .map((p) => ({
      ...p,
      category: fallbackCategories.find((c) => c.id === p.category_id) || null,
    }));
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
          (p) =>
            p.category &&
            (p.category.slug === options.categorySlug ||
              p.category.slug.startsWith(`${options.categorySlug}--`) ||
              p.category.description?.includes(`[Parent: ${options.categorySlug}]`))
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
