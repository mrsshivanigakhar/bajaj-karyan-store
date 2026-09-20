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

export function parseDietaryIntent(search?: string, dietaryOption?: string): {
  dietaryFilter?: 'veg' | 'non-veg' | 'egg';
  cleanedSearch?: string;
} {
  if (dietaryOption === 'veg' || dietaryOption === 'non-veg' || dietaryOption === 'egg') {
    return { dietaryFilter: dietaryOption, cleanedSearch: search?.trim() };
  }

  if (!search) return {};

  const lower = search.toLowerCase().trim();

  // Check for non-veg keywords first
  if (/^(non[-\s]?veg|non-vegetarian|meat|chicken|fish)$/i.test(lower)) {
    return { dietaryFilter: 'non-veg', cleanedSearch: '' };
  }
  if (/^egg$/i.test(lower)) {
    return { dietaryFilter: 'egg', cleanedSearch: '' };
  }

  // Check for veg keywords
  if (/^(veg|vegetarian|vegan|pure\s+veg|shuddh\s+shakahari)$/i.test(lower)) {
    return { dietaryFilter: 'veg', cleanedSearch: '' };
  }

  // Check for compound searches like "non veg snacks" or "vegetarian biscuits"
  const nonVegCompound = lower.match(/^(?:non[-\s]?veg|non-vegetarian)\s+(.+)$/i);
  if (nonVegCompound) {
    return { dietaryFilter: 'non-veg', cleanedSearch: nonVegCompound[1].trim() };
  }

  const vegCompound = lower.match(/^(?:veg|vegetarian|vegan|pure\s+veg)\s+(.+)$/i);
  if (vegCompound) {
    return { dietaryFilter: 'veg', cleanedSearch: vegCompound[1].trim() };
  }

  return { cleanedSearch: search.trim() };
}

export async function getPaginatedProducts(options?: {
  categorySlug?: string;
  featuredOnly?: boolean;
  search?: string;
  priceType?: string;
  dietary?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
}): Promise<PaginatedProductsResult> {
  const page = Math.max(1, options?.page || 1);
  const pageSize = Math.max(1, options?.pageSize || 20);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { dietaryFilter, cleanedSearch } = parseDietaryIntent(options?.search, options?.dietary);

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

    if (options?.minPrice !== undefined || options?.maxPrice !== undefined) {
      const min = options.minPrice;
      const max = options.maxPrice;
      if (min !== undefined && max !== undefined) {
        query = query.or(
          `and(sale_price.is.null,price.gte.${min},price.lte.${max}),and(sale_price.not.is.null,sale_price.gte.${min},sale_price.lte.${max})`
        );
      } else if (min !== undefined) {
        query = query.or(
          `and(sale_price.is.null,price.gte.${min}),and(sale_price.not.is.null,sale_price.gte.${min})`
        );
      } else if (max !== undefined) {
        query = query.or(
          `and(sale_price.is.null,price.not.is.null,price.lte.${max}),and(sale_price.not.is.null,sale_price.lte.${max})`
        );
      }
    }

    if (dietaryFilter) {
      if (dietaryFilter === 'veg') {
        query = query.or('dietary_preference.eq.veg,dietary_preference.is.null');
      } else {
        query = query.eq('dietary_preference', dietaryFilter);
      }
    }

    if (cleanedSearch) {
      query = query.ilike('name', `%${cleanedSearch}%`);
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

  if (options?.minPrice !== undefined || options?.maxPrice !== undefined) {
    products = products.filter((p) => {
      const eff = p.sale_price ?? p.price;
      if (eff === null || eff === undefined) return false;
      if (options.minPrice !== undefined && eff < options.minPrice) return false;
      if (options.maxPrice !== undefined && eff > options.maxPrice) return false;
      return true;
    });
  }

  if (dietaryFilter) {
    if (dietaryFilter === 'veg') {
      products = products.filter((p) => !p.dietary_preference || p.dietary_preference === 'veg');
    } else {
      products = products.filter((p) => p.dietary_preference === dietaryFilter);
    }
  }

  if (cleanedSearch) {
    const term = cleanedSearch.toLowerCase();
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
  dietary?: string;
  limit?: number;
}): Promise<Product[]> {
  const { dietaryFilter, cleanedSearch } = parseDietaryIntent(options?.search, options?.dietary);

  try {
    const supabase = await createClient();
    let query = supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('is_active', true);

    if (options?.featuredOnly) {
      query = query.eq('is_featured', true);
    }

    if (dietaryFilter) {
      if (dietaryFilter === 'veg') {
        query = query.or('dietary_preference.eq.veg,dietary_preference.is.null');
      } else {
        query = query.eq('dietary_preference', dietaryFilter);
      }
    }

    if (cleanedSearch) {
      query = query.ilike('name', `%${cleanedSearch}%`);
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

  if (dietaryFilter) {
    if (dietaryFilter === 'veg') {
      products = products.filter((p) => !p.dietary_preference || p.dietary_preference === 'veg');
    } else {
      products = products.filter((p) => p.dietary_preference === dietaryFilter);
    }
  }

  if (cleanedSearch) {
    const term = cleanedSearch.toLowerCase();
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

export interface DealsGroup {
  all: Product[];
  tier10to15: Product[];
  tier16to25: Product[];
  tier26to35: Product[];
  tierAbove35: Product[];
}

export async function getDealsProducts(): Promise<DealsGroup> {
  let products: Product[] = [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('is_active', true)
      .not('price', 'is', null)
      .not('sale_price', 'is', null);

    if (!error && data && data.length > 0) {
      products = (data as Product[]).filter(
        (p) => p.price !== null && p.sale_price !== null && p.sale_price < p.price
      );
    }
  } catch {
    // fallback
  }

  if (products.length === 0) {
    products = fallbackProducts
      .filter((p) => p.price !== null && p.sale_price !== null && p.sale_price < p.price)
      .map((p) => ({
        ...p,
        category: fallbackCategories.find((c) => c.id === p.category_id) || null,
      }));
  }

  // Sort by discount percentage descending
  const sorted = [...products].sort((a, b) => {
    const discA = Math.round((((a.price || 0) - (a.sale_price || 0)) / (a.price || 1)) * 100);
    const discB = Math.round((((b.price || 0) - (b.sale_price || 0)) / (b.price || 1)) * 100);
    return discB - discA;
  });

  const tier10to15: Product[] = [];
  const tier16to25: Product[] = [];
  const tier26to35: Product[] = [];
  const tierAbove35: Product[] = [];

  sorted.forEach((p) => {
    if (!p.price || !p.sale_price) return;
    const discount = Math.round(((p.price - p.sale_price) / p.price) * 100);
    if (discount >= 10 && discount <= 15) {
      tier10to15.push(p);
    } else if (discount >= 16 && discount <= 25) {
      tier16to25.push(p);
    } else if (discount >= 26 && discount <= 35) {
      tier26to35.push(p);
    } else if (discount > 35) {
      tierAbove35.push(p);
    }
  });

  return {
    all: sorted,
    tier10to15,
    tier16to25,
    tier26to35,
    tierAbove35,
  };
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
