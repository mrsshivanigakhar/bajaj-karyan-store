'use server';

import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/admin';
import { storeSettingsSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';

export async function updateStoreSettingsAction(id: string, formData: any) {
  try {
    await requireAdmin();
    const validated = storeSettingsSchema.parse(formData);
    const supabase = await createClient();

    const { error } = await supabase
      .from('store_settings')
      .update(validated)
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/', 'layout');
    revalidatePath('/admin/settings');
    revalidatePath('/checkout');
    revalidatePath('/shop');
    revalidatePath('/categories');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update settings' };
  }
}
