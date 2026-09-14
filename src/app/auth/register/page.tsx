'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Store, Lock, Mail, User, Phone, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    address: '',
    city: 'Amritsar',
    pincode: '143001',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        // Update profile table if user is instantly created
        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            full_name: formData.fullName,
            phone: formData.phone,
            email: formData.email,
            role: 'customer',
            address: formData.address,
            city: formData.city,
            pincode: formData.pincode,
          });
        }

        setSuccessMsg(
          'Account created successfully! Redirecting you to sign in...'
        );
        setTimeout(() => {
          router.push('/auth/login');
        }, 1800);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Unable to register account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-[#590d22] text-white flex items-center justify-center shadow-md mb-3">
            <Store className="w-7 h-7 text-pink-300" />
          </div>
          <span className="font-extrabold text-2xl font-serif text-[#590d22] uppercase tracking-wider">
            BAJAJ KARYAN STORE
          </span>
          <span className="text-xs text-rose-800 uppercase tracking-widest -mt-0.5">
            Create Customer Account
          </span>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-rose-100 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">New Customer Registration</h2>
            <p className="text-xs text-gray-500 mt-1">
              Save your address for quick ordering and easily track past requests.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  name="fullName"
                  placeholder="e.g. Gurpreet Singh"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full text-sm pl-10 pr-3 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
                />
                <User className="w-4 h-4 text-rose-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Mobile Phone Number *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  name="phone"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full text-sm pl-10 pr-3 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
                />
                <Phone className="w-4 h-4 text-rose-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full text-sm pl-10 pr-3 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
                />
                <Mail className="w-4 h-4 text-rose-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Password * (min. 6 characters)
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={6}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full text-sm pl-10 pr-3 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
                />
                <Lock className="w-4 h-4 text-rose-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Delivery Address (Optional)
              </label>
              <input
                type="text"
                name="address"
                placeholder="House No, Street, Landmark"
                value={formData.address}
                onChange={handleChange}
                className="w-full text-sm px-3 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#800f2f] hover:bg-[#a4133c] text-white py-3 px-4 rounded-xl font-bold text-sm shadow-md transition disabled:bg-gray-300"
            >
              {loading ? (
                <span>Registering Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-rose-100 text-center text-xs text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-bold text-[#800f2f] hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
