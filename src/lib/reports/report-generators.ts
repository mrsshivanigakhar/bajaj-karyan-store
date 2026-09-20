import { Product, Category, Order } from '@/types/database';
import { exportToPdf, exportToExcel, PdfReportOptions, ExcelReportOptions } from './export-utils';
import { formatCurrency, formatUnit } from '@/lib/utils';

// Helper to format date cleanly
const formatReportDate = (isoStr?: string) => {
  if (!isoStr) return '-';
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return isoStr;
  }
};

/**
 * -------------------------------------------------------------
 * 1. PRODUCTS REPORT GENERATION
 * -------------------------------------------------------------
 */
export function generateProductsReport(
  products: Product[],
  categories: Category[],
  type: 'pdf' | 'excel',
  options?: { filterCategory?: string; filterSearch?: string }
) {
  const categoryMap = new Map<string, string>();
  categories.forEach((c) => categoryMap.set(c.id, c.name));

  const totalProducts = products.length;
  const inStock = products.filter((p) => p.stock_quantity > 10).length;
  const lowStock = products.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= 10).length;
  const outOfStock = products.filter((p) => p.stock_quantity <= 0).length;

  const totalValuation = products.reduce((acc, p) => {
    const pr = p.sale_price ?? p.price ?? 0;
    return acc + pr * (p.stock_quantity || 0);
  }, 0);

  const dateTag = new Date().toISOString().split('T')[0];

  const headers = [
    '#',
    'Product Name',
    'Category',
    'SKU',
    'Unit',
    'Price (INR)',
    'Stock Qty',
    'Stock Status',
    'Active',
  ];

  const rows = products.map((p, idx) => {
    const catName = p.category?.name || (p.category_id ? categoryMap.get(p.category_id) : 'Uncategorized') || 'Uncategorized';
    const priceStr = p.price !== null ? `₹${p.price}` : 'On Request';
    const stockStatus =
      p.stock_quantity <= 0
        ? 'Out of Stock'
        : p.stock_quantity <= 10
        ? 'Low Stock'
        : 'In Stock';

    return [
      idx + 1,
      p.name,
      catName,
      p.sku || '-',
      formatUnit(p.unit_type, p.unit_value),
      priceStr,
      p.stock_quantity,
      stockStatus,
      p.is_active ? 'Yes' : 'No',
    ];
  });

  const metaInfo: { label: string; value: string | number }[] = [
    { label: 'Total Items', value: totalProducts },
  ];
  if (options?.filterCategory) {
    metaInfo.push({ label: 'Category Filter', value: options.filterCategory });
  }
  if (options?.filterSearch) {
    metaInfo.push({ label: 'Search Query', value: options.filterSearch });
  }

  const summaryCards = [
    { label: 'Total Products', value: totalProducts },
    { label: 'In Stock', value: inStock },
    { label: 'Low Stock', value: lowStock },
    { label: 'Out of Stock', value: outOfStock },
    { label: 'Catalog Valuation', value: `₹${totalValuation.toLocaleString('en-IN')}` },
  ];

  if (type === 'pdf') {
    exportToPdf({
      fileName: `BajajKaryan_Products_Report_${dateTag}`,
      title: 'Products Catalog & Inventory Report',
      subtitle: 'Comprehensive inventory valuation, pricing, and stock levels.',
      metaInfo,
      summaryCards,
      head: [headers],
      body: rows,
      orientation: 'landscape',
      columnStyles: {
        0: { halign: 'center', cellWidth: 10 },
        1: { halign: 'left', cellWidth: 55 },
        2: { halign: 'left', cellWidth: 35 },
        3: { halign: 'center', cellWidth: 25 },
        4: { halign: 'left', cellWidth: 22 },
        5: { halign: 'right', cellWidth: 25 },
        6: { halign: 'right', cellWidth: 20 },
        7: { halign: 'center', cellWidth: 25 },
        8: { halign: 'center', cellWidth: 16 },
      },
    });
  } else {
    exportToExcel({
      fileName: `BajajKaryan_Products_Report_${dateTag}`,
      sheetName: 'Products Catalog',
      title: 'Products Catalog & Inventory Report',
      metaInfo,
      headers,
      rows,
    });
  }
}

/**
 * -------------------------------------------------------------
 * 2. CATEGORIES REPORT GENERATION
 * -------------------------------------------------------------
 */
export function generateCategoriesReport(
  categories: Category[],
  type: 'pdf' | 'excel'
) {
  const dateTag = new Date().toISOString().split('T')[0];
  const activeCount = categories.filter((c) => c.is_active).length;

  const headers = [
    '#',
    'Category Name',
    'Slug',
    'Display Order',
    'Status',
    'Created At',
    'Description',
  ];

  const rows = categories.map((cat, idx) => [
    idx + 1,
    cat.name,
    cat.slug,
    cat.sort_order ?? idx + 1,
    cat.is_active ? 'Active' : 'Inactive',
    formatReportDate(cat.created_at),
    cat.description || 'N/A',
  ]);

  const summaryCards = [
    { label: 'Total Categories', value: categories.length },
    { label: 'Active in Storefront', value: activeCount },
    { label: 'Inactive Categories', value: categories.length - activeCount },
  ];

  if (type === 'pdf') {
    exportToPdf({
      fileName: `BajajKaryan_Categories_Report_${dateTag}`,
      title: 'Store Categories Taxonomy Report',
      subtitle: 'Complete list of product categories, hierarchy order, and storefront status.',
      metaInfo: [{ label: 'Total Categories', value: categories.length }],
      summaryCards,
      head: [headers],
      body: rows,
      orientation: 'portrait',
      columnStyles: {
        0: { halign: 'center', cellWidth: 10 },
        1: { halign: 'left', cellWidth: 40 },
        2: { halign: 'left', cellWidth: 35 },
        3: { halign: 'center', cellWidth: 18 },
        4: { halign: 'center', cellWidth: 18 },
        5: { halign: 'center', cellWidth: 22 },
        6: { halign: 'left' },
      },
    });
  } else {
    exportToExcel({
      fileName: `BajajKaryan_Categories_Report_${dateTag}`,
      sheetName: 'Categories',
      title: 'Store Categories Taxonomy Report',
      headers,
      rows,
    });
  }
}

/**
 * -------------------------------------------------------------
 * 3. ORDERS REPORT GENERATION
 * -------------------------------------------------------------
 */
export function generateOrdersReport(
  orders: Order[],
  type: 'pdf' | 'excel',
  options?: { filterStatus?: string; filterSearch?: string }
) {
  const dateTag = new Date().toISOString().split('T')[0];

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.final_total || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;

  const headers = [
    'Order #',
    'Date',
    'Customer Name',
    'Phone',
    'Fulfillment Status',
    'Payment Method',
    'Payment Status',
    'Items',
    'Total (INR)',
  ];

  const rows = orders.map((o) => [
    o.order_number,
    formatReportDate(o.created_at),
    o.customer_name,
    o.customer_phone,
    o.status.toUpperCase(),
    o.payment_method?.toUpperCase() || 'COD',
    o.payment_status.toUpperCase(),
    o.order_items ? o.order_items.length : 1,
    `₹${(o.final_total || 0).toLocaleString('en-IN')}`,
  ]);

  const metaInfo: { label: string; value: string | number }[] = [
    { label: 'Total Orders', value: totalOrders },
  ];
  if (options?.filterStatus && options.filterStatus !== 'all') {
    metaInfo.push({ label: 'Status Filter', value: options.filterStatus.toUpperCase() });
  }
  if (options?.filterSearch) {
    metaInfo.push({ label: 'Search Query', value: options.filterSearch });
  }

  const summaryCards = [
    { label: 'Total Orders', value: totalOrders },
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}` },
    { label: 'Pending Fulfillment', value: pendingOrders },
    { label: 'Delivered Orders', value: deliveredOrders },
  ];

  if (type === 'pdf') {
    exportToPdf({
      fileName: `BajajKaryan_Orders_Report_${dateTag}`,
      title: 'Orders & Sales Revenue Report',
      subtitle: 'Order fulfillment status, payment breakdown, and total store revenue.',
      metaInfo,
      summaryCards,
      head: [headers],
      body: rows,
      orientation: 'landscape',
      columnStyles: {
        0: { halign: 'left', cellWidth: 28 },
        1: { halign: 'center', cellWidth: 22 },
        2: { halign: 'left', cellWidth: 38 },
        3: { halign: 'center', cellWidth: 26 },
        4: { halign: 'center', cellWidth: 28 },
        5: { halign: 'center', cellWidth: 24 },
        6: { halign: 'center', cellWidth: 22 },
        7: { halign: 'center', cellWidth: 14 },
        8: { halign: 'right', cellWidth: 26 },
      },
    });
  } else {
    exportToExcel({
      fileName: `BajajKaryan_Orders_Report_${dateTag}`,
      sheetName: 'Orders Summary',
      title: 'Orders & Sales Revenue Report',
      metaInfo,
      headers,
      rows,
    });
  }
}

/**
 * -------------------------------------------------------------
 * 4. INVENTORY & VALUATION REPORT GENERATION
 * -------------------------------------------------------------
 */
export function generateInventoryReport(
  products: Product[],
  lowStockThreshold: number,
  type: 'pdf' | 'excel',
  options?: { filter?: 'all' | 'low' | 'out'; search?: string }
) {
  const dateTag = new Date().toISOString().split('T')[0];

  const totalItems = products.length;
  const outOfStock = products.filter((p) => p.stock_quantity <= 0).length;
  const lowStock = products.filter(
    (p) => p.stock_quantity > 0 && p.stock_quantity <= lowStockThreshold
  ).length;
  const healthyStock = products.filter((p) => p.stock_quantity > lowStockThreshold).length;

  const totalValuation = products.reduce((acc, p) => {
    const pr = p.sale_price ?? p.price ?? 0;
    return acc + pr * (p.stock_quantity || 0);
  }, 0);

  const headers = [
    '#',
    'Product Name',
    'SKU',
    'Unit',
    'Price (INR)',
    'Stock Level',
    'Min Threshold',
    'Stock Status',
    'Inventory Value (INR)',
  ];

  const rows = products.map((p, idx) => {
    const pr = p.sale_price ?? p.price ?? 0;
    const valuation = pr * (p.stock_quantity || 0);
    const stockStatus =
      p.stock_quantity <= 0
        ? 'OUT OF STOCK'
        : p.stock_quantity <= lowStockThreshold
        ? 'LOW STOCK'
        : 'HEALTHY';

    return [
      idx + 1,
      p.name,
      p.sku || '-',
      formatUnit(p.unit_type, p.unit_value),
      pr > 0 ? `₹${pr}` : 'On Request',
      p.stock_quantity,
      lowStockThreshold,
      stockStatus,
      `₹${valuation.toLocaleString('en-IN')}`,
    ];
  });

  const metaInfo: { label: string; value: string | number }[] = [
    { label: 'Low Stock Threshold', value: lowStockThreshold },
    { label: 'Total Tracked Products', value: totalItems },
  ];
  if (options?.filter && options.filter !== 'all') {
    metaInfo.push({ label: 'Stock Filter', value: options.filter.toUpperCase() });
  }

  const summaryCards = [
    { label: 'Tracked Items', value: totalItems },
    { label: 'Healthy Stock', value: healthyStock },
    { label: 'Low Stock Alert', value: lowStock },
    { label: 'Out of Stock', value: outOfStock },
    { label: 'Total Stock Valuation', value: `₹${totalValuation.toLocaleString('en-IN')}` },
  ];

  if (type === 'pdf') {
    exportToPdf({
      fileName: `BajajKaryan_Inventory_Report_${dateTag}`,
      title: 'Warehouse Inventory & Valuation Report',
      subtitle: `Current stock counts, reorder warnings (threshold <= ${lowStockThreshold}), and holding value.`,
      metaInfo,
      summaryCards,
      head: [headers],
      body: rows,
      orientation: 'landscape',
      columnStyles: {
        0: { halign: 'center', cellWidth: 10 },
        1: { halign: 'left', cellWidth: 60 },
        2: { halign: 'center', cellWidth: 26 },
        3: { halign: 'left', cellWidth: 22 },
        4: { halign: 'right', cellWidth: 24 },
        5: { halign: 'right', cellWidth: 22 },
        6: { halign: 'center', cellWidth: 22 },
        7: { halign: 'center', cellWidth: 26 },
        8: { halign: 'right', cellWidth: 32 },
      },
    });
  } else {
    exportToExcel({
      fileName: `BajajKaryan_Inventory_Report_${dateTag}`,
      sheetName: 'Inventory Valuation',
      title: 'Warehouse Inventory & Valuation Report',
      metaInfo,
      headers,
      rows,
    });
  }
}

/**
 * -------------------------------------------------------------
 * 5. CUSTOMERS REPORT GENERATION
 * -------------------------------------------------------------
 */
export function generateCustomersReport(
  customers: any[],
  type: 'pdf' | 'excel'
) {
  const dateTag = new Date().toISOString().split('T')[0];

  const totalCustomers = customers.length;
  let totalOrdersSum = 0;
  let totalSpendSum = 0;

  customers.forEach((c) => {
    const orders = c.orders || [];
    totalOrdersSum += orders.length;
    orders.forEach((o: any) => {
      totalSpendSum += o.final_total || 0;
    });
  });

  const headers = [
    '#',
    'Customer Name',
    'Email Address',
    'Phone',
    'City',
    'Registered Date',
    'Total Orders',
    'Lifetime Spend (INR)',
  ];

  const rows = customers.map((c, idx) => {
    const orders = c.orders || [];
    const customerSpend = orders.reduce((sum: number, o: any) => sum + (o.final_total || 0), 0);

    return [
      idx + 1,
      c.full_name || 'Anonymous User',
      c.email || '-',
      c.phone || '-',
      c.city || c.address ? (c.city || c.address) : '-',
      formatReportDate(c.created_at),
      orders.length,
      `₹${customerSpend.toLocaleString('en-IN')}`,
    ];
  });

  const summaryCards = [
    { label: 'Registered Customers', value: totalCustomers },
    { label: 'Total Orders Placed', value: totalOrdersSum },
    { label: 'Total Customer Spend', value: `₹${totalSpendSum.toLocaleString('en-IN')}` },
  ];

  if (type === 'pdf') {
    exportToPdf({
      fileName: `BajajKaryan_Customers_Report_${dateTag}`,
      title: 'Customer Directory & Accounts Report',
      subtitle: 'Registered customer profiles, ordering frequencies, and cumulative revenue contribution.',
      metaInfo: [{ label: 'Total Profiles', value: totalCustomers }],
      summaryCards,
      head: [headers],
      body: rows,
      orientation: 'landscape',
      columnStyles: {
        0: { halign: 'center', cellWidth: 10 },
        1: { halign: 'left', cellWidth: 40 },
        2: { halign: 'left', cellWidth: 50 },
        3: { halign: 'center', cellWidth: 28 },
        4: { halign: 'left', cellWidth: 32 },
        5: { halign: 'center', cellWidth: 26 },
        6: { halign: 'center', cellWidth: 20 },
        7: { halign: 'right', cellWidth: 32 },
      },
    });
  } else {
    exportToExcel({
      fileName: `BajajKaryan_Customers_Report_${dateTag}`,
      sheetName: 'Customer Directory',
      title: 'Customer Directory & Accounts Report',
      headers,
      rows,
    });
  }
}
