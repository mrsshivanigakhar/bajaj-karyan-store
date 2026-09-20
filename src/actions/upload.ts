'use server';

import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/admin';

export async function uploadImageAction(formData: FormData): Promise<{
  success: boolean;
  url?: string;
  error?: string;
}> {
  try {
    await requireAdmin();

    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'products';

    if (!file || !(file instanceof File) || file.size === 0) {
      return { success: false, error: 'Please choose an image file to upload.' };
    }

    // Validate mime type
    const validMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'image/avif',
    ];
    if (!validMimes.includes(file.type.toLowerCase())) {
      return {
        success: false,
        error: 'Invalid file format. Please upload a JPEG, PNG, WebP, GIF, or SVG image.',
      };
    }

    // Limit to 10MB
    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: 'File size exceeds 10MB limit.' };
    }

    const supabase = await createClient();

    // Prepare clean unique file name
    const rawExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const cleanExt = rawExt === 'jpeg' ? 'jpg' : rawExt;
    const sanitizedBase = file.name
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
      .slice(0, 35) || 'image';

    const uniqueFileName = `${sanitizedBase}-${Date.now()}.${cleanExt}`;
    const filePath = `${folder}/${uniqueFileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to 'store' bucket
    const { error: uploadError } = await supabase.storage
      .from('store')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      return { success: false, error: uploadError.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from('store').getPublicUrl(filePath);

    return {
      success: true,
      url: urlData.publicUrl,
    };
  } catch (err: any) {
    console.error('Upload action error:', err);
    return {
      success: false,
      error: err?.message || 'Failed to upload image. Please try again.',
    };
  }
}
