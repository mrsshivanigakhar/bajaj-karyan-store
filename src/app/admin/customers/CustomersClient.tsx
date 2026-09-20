'use client';

import React, { useState, useMemo } from 'react';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Users, Phone, Mail, MapPin, ShoppingBag, Search, X, ShieldCheck, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { AdminReportToolbar } from '@/components/admin/AdminReportToolbar';
import { generateCustomersReport } from '@/lib/reports/report-generators';

interface ProfileWithOrders {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  role: string;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  avatar_url: string | null;
  created_at: string;
  orders: {
    id: string;
    order_number: string;
    final_total: number | null;
    created_at: string;
  }[];
}

export function CustomersClient({ initialUsers }: { initialUsers: ProfileWithOrders[] }) {
  const [users] = useState<ProfileWithOrders[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'customer' | 'all' | 'admin'>('customer');

  const customerCount = useMemo(() => users.filter((u) => u.role === 'customer').length, [users]);
  const adminCount = useMemo(() => users.filter((u) => u.role === 'admin').length, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Role filter
      if (roleFilter !== 'all' && u.role !== roleFilter) {
        return false;
      }
      // Search filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const name = (u.full_name || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      const phone = (u.phone || '').toLowerCase();
      const city = (u.city || '').toLowerCase();
      return name.includes(q) || email.includes(q) || phone.includes(q) || city.includes(q);
    });
  }, [users, roleFilter, searchQuery]);

  const handleExportPdf = (scope: 'filtered' | 'all') => {
    const list = scope === 'filtered' ? filteredUsers : users;
    generateCustomersReport(list, 'pdf');
  };

  const handleExportExcel = (scope: 'filtered' | 'all') => {
    const list = scope === 'filtered' ? filteredUsers : users;
    generateCustomersReport(list, 'excel');
  };

  return (
    <div className="w-full space-y-6">
      {/* Reports & Export Toolbar */}
      <AdminReportToolbar
        title="Customer Directory & Accounts Report"
        subtitle="Export customer profiles, registered contact information, order history, and spending."
        totalCount={users.length}
        filteredCount={filteredUsers.length}
        onExportPdf={handleExportPdf}
        onExportExcel={handleExportExcel}
      />

      {/* Search and Filter Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-rose-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, email..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Role Tabs */}
        <div className="flex items-center gap-1.5 bg-rose-50/60 p-1.5 rounded-2xl border border-rose-200/60 w-full sm:w-auto overflow-x-auto">
          <button
            type="button"
            onClick={() => setRoleFilter('customer')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              roleFilter === 'customer'
                ? 'bg-[#800f2f] text-white shadow-2xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Customers ({customerCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setRoleFilter('admin')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              roleFilter === 'admin'
                ? 'bg-[#800f2f] text-white shadow-2xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admins ({adminCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setRoleFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              roleFilter === 'all'
                ? 'bg-[#800f2f] text-white shadow-2xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>All Accounts ({users.length})</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-rose-100 shadow-xs overflow-hidden w-full">
        {filteredUsers.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            <Users className="w-12 h-12 text-rose-300 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 text-base mb-1">
              {searchQuery ? 'No accounts matched your search' : 'No customers found'}
            </h3>
            <p className="text-xs text-gray-400">
              {searchQuery
                ? 'Try adjusting your search keywords.'
                : 'Registered accounts will appear here automatically.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-rose-50/50 text-xs font-bold text-gray-600 uppercase tracking-wider border-b border-rose-100">
                <tr>
                  <th className="py-3.5 px-6">Account / Customer</th>
                  <th className="py-3.5 px-6">Contact Details</th>
                  <th className="py-3.5 px-6">Delivery Address</th>
                  <th className="py-3.5 px-6 text-center">Orders Placed</th>
                  <th className="py-3.5 px-6 text-center">Role</th>
                  <th className="py-3.5 px-6 text-right">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50 text-xs sm:text-sm">
                {filteredUsers.map((u) => {
                  const totalSpent = u.orders.reduce(
                    (sum, o) => sum + (Number(o.final_total) || 0),
                    0
                  );

                  return (
                    <tr key={u.id} className="hover:bg-rose-50/20 transition">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-rose-100 text-[#800f2f] flex items-center justify-center font-bold text-sm shrink-0">
                            {(u.full_name || u.email || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 block">
                              {u.full_name || 'Anonymous User'}
                            </span>
                            <span className="text-xs text-gray-400 font-mono">
                              ID: {u.id.slice(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 space-y-1">
                        {u.email && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-700">
                            <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <a
                              href={`mailto:${u.email}`}
                              className="hover:text-[#800f2f] hover:underline"
                            >
                              {u.email}
                            </a>
                          </div>
                        )}
                        {u.phone ? (
                          <div className="flex items-center gap-1.5 text-xs text-gray-700">
                            <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <a
                              href={`tel:${u.phone}`}
                              className="hover:underline text-[#800f2f] font-semibold"
                            >
                              {u.phone}
                            </a>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 block">—</span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-xs text-gray-600 max-w-xs">
                        {u.address || u.city ? (
                          <div className="flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                            <span className="truncate">
                              {[u.address, u.city, u.state, u.pincode].filter(Boolean).join(', ')}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">No address saved</span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-center">
                        <span className="font-bold text-gray-900 block">
                          {u.orders.length} orders
                        </span>
                        {totalSpent > 0 && (
                          <span className="text-[11px] text-gray-500 font-medium">
                            {formatCurrency(totalSpent)} spent
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {u.role === 'admin' ? (
                            <>
                              <ShieldCheck className="w-3 h-3" />
                              <span>Admin</span>
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-3 h-3" />
                              <span>Customer</span>
                            </>
                          )}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right text-xs text-gray-500 font-mono">
                        {formatDate(u.created_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
