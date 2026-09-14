import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Profile } from '@/types/database';

export async function getCurrentUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

export async function getUserProfile(userId: string): Promise<Profile | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return data as Profile;
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  const profile = await getUserProfile(user.id);
  return { user, profile };
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login?redirect=/admin');
  }

  const profile = await getUserProfile(user.id);

  // If user is not an admin, redirect or throw unauthorized
  if (!profile || profile.role !== 'admin') {
    redirect('/?error=unauthorized');
  }

  return { user, profile };
}
