'use client';

import React from 'react';
import { Product, Category } from '@/types/database';
import { AdminReportToolbar } from '@/components/admin/AdminReportToolbar';
import { generateProductsReport } from '@/lib/reports/report-generators';

interface ProductsReportToolbarProps {
  filteredProducts: Product[];
  allProducts: Product[];
  categories: Category[];
  currentCategoryName?: string;
  currentSearch?: string;
}

export function ProductsReportToolbar({
  filteredProducts,
  allProducts,
  categories,
  currentCategoryName,
  currentSearch,
}: ProductsReportToolbarProps) {
  const handleExportPdf = (scope: 'filtered' | 'all') => {
    const list = scope === 'filtered' ? filteredProducts : allProducts;
    generateProductsReport(list, categories, 'pdf', {
      filterCategory: scope === 'filtered' ? currentCategoryName : undefined,
      filterSearch: scope === 'filtered' ? currentSearch : undefined,
    });
  };

  const handleExportExcel = (scope: 'filtered' | 'all') => {
    const list = scope === 'filtered' ? filteredProducts : allProducts;
    generateProductsReport(list, categories, 'excel', {
      filterCategory: scope === 'filtered' ? currentCategoryName : undefined,
      filterSearch: scope === 'filtered' ? currentSearch : undefined,
    });
  };

  return (
    <AdminReportToolbar
      title="Product Catalog & Inventory Reports"
      subtitle="Export catalog details, inventory status, units, and rates."
      totalCount={allProducts.length}
      filteredCount={filteredProducts.length}
      onExportPdf={handleExportPdf}
      onExportExcel={handleExportExcel}
    />
  );
}
