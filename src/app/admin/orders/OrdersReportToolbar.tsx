'use client';

import React from 'react';
import { Order } from '@/types/database';
import { AdminReportToolbar } from '@/components/admin/AdminReportToolbar';
import { generateOrdersReport } from '@/lib/reports/report-generators';

interface OrdersReportToolbarProps {
  filteredOrders: Order[];
  allOrders: Order[];
  currentStatus?: string;
  currentSearch?: string;
}

export function OrdersReportToolbar({
  filteredOrders,
  allOrders,
  currentStatus,
  currentSearch,
}: OrdersReportToolbarProps) {
  const handleExportPdf = (scope: 'filtered' | 'all') => {
    const list = scope === 'filtered' ? filteredOrders : allOrders;
    generateOrdersReport(list, 'pdf', {
      filterStatus: scope === 'filtered' ? currentStatus : undefined,
      filterSearch: scope === 'filtered' ? currentSearch : undefined,
    });
  };

  const handleExportExcel = (scope: 'filtered' | 'all') => {
    const list = scope === 'filtered' ? filteredOrders : allOrders;
    generateOrdersReport(list, 'excel', {
      filterStatus: scope === 'filtered' ? currentStatus : undefined,
      filterSearch: scope === 'filtered' ? currentSearch : undefined,
    });
  };

  return (
    <AdminReportToolbar
      title="Orders & Sales Revenue Report"
      subtitle="Export order histories, payment breakdowns, delivery status, and revenues."
      totalCount={allOrders.length}
      filteredCount={filteredOrders.length}
      onExportPdf={handleExportPdf}
      onExportExcel={handleExportExcel}
    />
  );
}
