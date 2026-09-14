import React from 'react';
import { notFound } from 'next/navigation';
import { getOrderById, getStoreSettings } from '@/services/store-service';
import { formatCurrency, formatDate, formatUnit } from '@/lib/utils';
import { PrinterViewClient } from './PrinterViewClient';

interface PrintOrderPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PrintOrderPage({ params }: PrintOrderPageProps) {
  const { id } = await params;
  const [order, settings] = await Promise.all([
    getOrderById(id),
    getStoreSettings(),
  ]);

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white text-black p-4 sm:p-8 font-sans">
      <PrinterViewClient order={order} settings={settings} />
    </div>
  );
}
