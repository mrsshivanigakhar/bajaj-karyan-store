import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOrderById, getStoreSettings } from '@/services/store-service';
import { AdminOrderDetailClient } from './AdminOrderDetailClient';
import { ArrowLeft, Printer } from 'lucide-react';

interface AdminOrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { id } = await params;
  const [order, settings] = await Promise.all([
    getOrderById(id),
    getStoreSettings(),
  ]);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#800f2f] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Orders</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href={`/admin/orders/${order.id}/print`}
            target="_blank"
            className="inline-flex items-center gap-2 bg-white hover:bg-rose-50 text-gray-800 border border-rose-200 px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition"
          >
            <Printer className="w-4 h-4 text-pink-600" />
            <span>Print Invoice / Receipt</span>
          </Link>
        </div>
      </div>

      <AdminOrderDetailClient initialOrder={order} storeSettings={settings} />
    </div>
  );
}
