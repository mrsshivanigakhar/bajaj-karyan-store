'use server';

import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/admin';
import { categorySchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';

export async function createCategoryAction(formData: any) {
  try {
    await requireAdmin();
    const validated = categorySchema.parse(formData);
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('categories')
      .insert({
        ...validated,
        image_url: validated.image_url || null,
        description: validated.description || null,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/categories');
    revalidatePath('/categories');
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to create category' };
  }
}

export async function updateCategoryAction(id: string, formData: any) {
  try {
    await requireAdmin();
    const validated = categorySchema.parse(formData);
    const supabase = await createClient();

    const { error } = await supabase
      .from('categories')
      .update({
        ...validated,
        image_url: validated.image_url || null,
        description: validated.description || null,
      })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/categories');
    revalidatePath('/categories');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update category' };
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    await requireAdmin();
    const supabase = await createClient();

    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/categories');
    revalidatePath('/categories');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete category' };
  }
}
