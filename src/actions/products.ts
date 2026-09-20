'use server';

import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/admin';
import { productSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';

function formatZodError(err: any): string {
  if (err?.issues && Array.isArray(err.issues)) {
    return err.issues.map((i: any) => i.message).join(', ');
  }
  return err?.message || 'An unexpected error occurred';
}

export async function createProductAction(formData: any) {
  try {
    await requireAdmin();
    const validated = productSchema.parse(formData);
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('products')
      .insert({
        ...validated,
        image_url: validated.image_url || null,
        description: validated.description || null,
        sku: validated.sku || null,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/products');
    revalidatePath('/shop');
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: formatZodError(err) };
  }
}

export async function updateProductAction(id: string, formData: any) {
  try {
    await requireAdmin();
    const validated = productSchema.parse(formData);
    const supabase = await createClient();

    const { error } = await supabase
      .from('products')
      .update({
        ...validated,
        image_url: validated.image_url || null,
        description: validated.description || null,
        sku: validated.sku || null,
      })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/products');
    revalidatePath('/admin/inventory');
    revalidatePath('/shop');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: formatZodError(err) };
  }
}

export async function deleteProductAction(id: string) {
  try {
    await requireAdmin();
    const supabase = await createClient();

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/products');
    revalidatePath('/shop');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete product' };
  }
}

export async function updateStockAction(id: string, newStock: number) {
  try {
    await requireAdmin();
    const supabase = await createClient();

    const { error } = await supabase
      .from('products')
      .update({
        stock_quantity: newStock,
        is_available: newStock > 0,
      })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/inventory');
    revalidatePath('/admin/products');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update stock' };
  }
}
