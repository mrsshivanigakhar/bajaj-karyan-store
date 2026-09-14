'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { User, Phone, MapPin, Mail, LogOut, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.push('/auth/login?redirect=/account/profile');
        return;
      }
      setUser(user);

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile(data);
      } else {
        setProfile({
          full_name: user.user_metadata?.full_name || '',
          phone: user.user_metadata?.phone || '',
          email: user.email,
          role: 'customer',
          address: '',
          city: 'Amritsar',
          state: 'Punjab',
          pincode: '143001',
        });
      }
      setLoading(false);
    });
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: profile.full_name,
          phone: profile.phone,
          address: profile.address,
          city: profile.city,
          state: profile.state,
          pincode: profile.pincode,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg('Profile details updated successfully!');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20 text-gray-500">
          Loading profile...
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfafb]">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#590d22] font-serif">
              My Profile
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your delivery details and account credentials.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition self-start sm:self-auto"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Role highlight if Admin */}
        {profile?.role === 'admin' && (
          <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-900 text-sm font-semibold">
              <Shield className="w-5 h-5 text-purple-700" />
              <span>You have Administrator access for Bajaj Karyan Store</span>
            </div>
            <Link
              href="/admin"
              className="bg-[#590d22] hover:bg-[#800f2f] text-white text-xs font-bold px-4 py-2 rounded-xl transition"
            >
              Open Admin Dashboard
            </Link>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-100 shadow-xs">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={profile?.full_name || ''}
                  onChange={handleChange}
                  className="w-full text-sm p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profile?.phone || ''}
                  onChange={handleChange}
                  className="w-full text-sm p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Email Address (Read-only)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full text-sm p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Default Delivery Address
              </label>
              <textarea
                name="address"
                rows={2}
                value={profile?.address || ''}
                onChange={handleChange}
                placeholder="House no., Street, Area..."
                className="w-full text-sm p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={profile?.city || 'Amritsar'}
                  onChange={handleChange}
                  className="w-full text-sm p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={profile?.state || 'Punjab'}
                  onChange={handleChange}
                  className="w-full text-sm p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  maxLength={6}
                  value={profile?.pincode || '143001'}
                  onChange={handleChange}
                  className="w-full text-sm p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-[#800f2f] hover:bg-[#a4133c] text-white px-7 py-3 rounded-xl font-bold text-sm shadow-sm transition"
            >
              {saving ? 'Saving changes...' : 'Save Profile Details'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
