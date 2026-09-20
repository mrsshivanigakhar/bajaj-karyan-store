"use client";

import React, { useState } from "react";
import { Product, Category, Order } from "@/types/database";
import {
  FileText,
  FileSpreadsheet,
  Package,
  Layers,
  ShoppingBag,
  Boxes,
  Users,
  Download,
  Loader2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import {
  generateProductsReport,
  generateCategoriesReport,
  generateOrdersReport,
  generateInventoryReport,
  generateCustomersReport,
} from "@/lib/reports/report-generators";
import * as XLSX from "xlsx";

interface ReportsHubClientProps {
  products: Product[];
  categories: Category[];
  orders: Order[];
  customers: any[];
  lowStockThreshold: number;
}

export function ReportsHubClient({
  products,
  categories,
  orders,
  customers,
  lowStockThreshold,
}: ReportsHubClientProps) {
  const [downloading, setDownloading] = useState<string | null>(null);

  // Quick stats
  const totalValuation = products.reduce((acc, p) => {
    const pr = p.sale_price ?? p.price ?? 0;
    return acc + pr * (p.stock_quantity || 0);
  }, 0);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.final_total || 0), 0);
  const lowStockCount = products.filter(
    (p) => p.stock_quantity > 0 && p.stock_quantity <= lowStockThreshold,
  ).length;
  const outOfStockCount = products.filter((p) => p.stock_quantity <= 0).length;

  const handleDownload = async (
    key: string,
    generator: () => void | Promise<void>,
  ) => {
    setDownloading(key);
    try {
      await generator();
    } catch (err) {
      console.error("Error generating report:", err);
    } finally {
      setTimeout(() => setDownloading(null), 1000);
    }
  };

  // Master Comprehensive Multi-Sheet Excel Workbook Export
  const exportMasterExcelWorkbook = () => {
    const dateTag = new Date().toISOString().split("T")[0];
    const wb = XLSX.utils.book_new();

    // 1. Overview Sheet
    const overviewData = [
      ["BAJAJ karyana STORE — MASTER STORE AUDIT REPORT"],
      [`Generated: ${new Date().toLocaleString("en-IN")}`],
      [],
      ["Metric", "Value"],
      ["Total Products", products.length],
      [
        "Total Inventory Valuation",
        `₹${totalValuation.toLocaleString("en-IN")}`,
      ],
      ["Low Stock Warnings", lowStockCount],
      ["Out of Stock Items", outOfStockCount],
      ["Total Categories", categories.length],
      ["Total Orders", orders.length],
      ["Total Sales Revenue", `₹${totalRevenue.toLocaleString("en-IN")}`],
      ["Total Registered Customers", customers.length],
    ];
    const wsOverview = XLSX.utils.aoa_to_sheet(overviewData);
    wsOverview["!cols"] = [{ wch: 30 }, { wch: 35 }];
    XLSX.utils.book_append_sheet(wb, wsOverview, "Store Overview");

    // 2. Products Sheet
    const productHeaders = [
      "#",
      "Name",
      "Category",
      "SKU",
      "Unit",
      "Price (INR)",
      "Stock",
      "Status",
    ];
    const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
    const productRows = products.map((p, i) => [
      i + 1,
      p.name,
      p.category?.name ||
        (p.category_id ? categoryMap.get(p.category_id) : "Uncategorized"),
      p.sku || "-",
      `${p.unit_value} ${p.unit_type}`,
      p.price ?? "On Request",
      p.stock_quantity,
      p.stock_quantity <= 0
        ? "Out of Stock"
        : p.stock_quantity <= 10
          ? "Low Stock"
          : "In Stock",
    ]);
    const wsProducts = XLSX.utils.aoa_to_sheet([
      productHeaders,
      ...productRows,
    ]);
    wsProducts["!cols"] = [
      { wch: 6 },
      { wch: 40 },
      { wch: 25 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 12 },
      { wch: 15 },
    ];
    XLSX.utils.book_append_sheet(wb, wsProducts, "Products");

    // 3. Categories Sheet
    const catHeaders = ["#", "Name", "Slug", "Order", "Active", "Description"];
    const catRows = categories.map((c, i) => [
      i + 1,
      c.name,
      c.slug,
      c.sort_order,
      c.is_active ? "Active" : "Inactive",
      c.description || "",
    ]);
    const wsCategories = XLSX.utils.aoa_to_sheet([catHeaders, ...catRows]);
    wsCategories["!cols"] = [
      { wch: 6 },
      { wch: 30 },
      { wch: 25 },
      { wch: 10 },
      { wch: 12 },
      { wch: 45 },
    ];
    XLSX.utils.book_append_sheet(wb, wsCategories, "Categories");

    // 4. Orders Sheet
    const orderHeaders = [
      "Order #",
      "Date",
      "Customer",
      "Phone",
      "Status",
      "Payment Status",
      "Total (INR)",
    ];
    const orderRows = orders.map((o) => [
      o.order_number,
      new Date(o.created_at).toLocaleDateString("en-IN"),
      o.customer_name,
      o.customer_phone,
      o.status.toUpperCase(),
      o.payment_status.toUpperCase(),
      o.final_total || 0,
    ]);
    const wsOrders = XLSX.utils.aoa_to_sheet([orderHeaders, ...orderRows]);
    wsOrders["!cols"] = [
      { wch: 25 },
      { wch: 15 },
      { wch: 30 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
    ];
    XLSX.utils.book_append_sheet(wb, wsOrders, "Orders");

    // 5. Customers Sheet
    const custHeaders = [
      "#",
      "Name",
      "Email",
      "Phone",
      "City",
      "Total Orders",
      "Total Spent (INR)",
    ];
    const custRows = customers.map((c, i) => {
      const oList = c.orders || [];
      const spend = oList.reduce(
        (sum: number, o: any) => sum + (o.final_total || 0),
        0,
      );
      return [
        i + 1,
        c.full_name || "Anonymous",
        c.email || "-",
        c.phone || "-",
        c.city || c.address || "-",
        oList.length,
        spend,
      ];
    });
    const wsCustomers = XLSX.utils.aoa_to_sheet([custHeaders, ...custRows]);
    wsCustomers["!cols"] = [
      { wch: 6 },
      { wch: 30 },
      { wch: 35 },
      { wch: 18 },
      { wch: 25 },
      { wch: 15 },
      { wch: 20 },
    ];
    XLSX.utils.book_append_sheet(wb, wsCustomers, "Customers");

    XLSX.writeFile(wb, `BajajKaryan_Master_Store_Audit_${dateTag}.xlsx`);
  };

  const reportCards = [
    {
      id: "products",
      title: "Products Catalog Report",
      description:
        "Complete inventory records, units, prices, active status, and store catalog metadata.",
      icon: Package,
      countLabel: `${products.length} Products`,
      badge: `₹${totalValuation.toLocaleString("en-IN")} Stock Value`,
      color: "rose",
      onPdf: () => generateProductsReport(products, categories, "pdf"),
      onExcel: () => generateProductsReport(products, categories, "excel"),
    },
    {
      id: "inventory",
      title: "Warehouse Inventory & Stock Valuation",
      description:
        "Stock balance, minimum alert thresholds, reorder warnings, and inventory asset values.",
      icon: Boxes,
      countLabel: `${products.length} Tracked Items`,
      badge: `${lowStockCount} Low Stock Alert`,
      color: "amber",
      onPdf: () => generateInventoryReport(products, lowStockThreshold, "pdf"),
      onExcel: () =>
        generateInventoryReport(products, lowStockThreshold, "excel"),
    },
    {
      id: "orders",
      title: "Orders & Sales Revenue Report",
      description:
        "Fulfillment tracking, delivery logs, payment methods, customer phone numbers, and revenue totals.",
      icon: ShoppingBag,
      countLabel: `${orders.length} Orders`,
      badge: `₹${totalRevenue.toLocaleString("en-IN")} Revenue`,
      color: "emerald",
      onPdf: () => generateOrdersReport(orders, "pdf"),
      onExcel: () => generateOrdersReport(orders, "excel"),
    },
    {
      id: "categories",
      title: "Categories & Taxonomy Report",
      description:
        "Category names, slugs, storefront display sort order, and active customer-facing status.",
      icon: Layers,
      countLabel: `${categories.length} Categories`,
      badge: `${categories.filter((c) => c.is_active).length} Active`,
      color: "purple",
      onPdf: () => generateCategoriesReport(categories, "pdf"),
      onExcel: () => generateCategoriesReport(categories, "excel"),
    },
    {
      id: "customers",
      title: "Customer Directory & Accounts Report",
      description:
        "Registered customer accounts, contact details, delivery addresses, and lifetime customer value.",
      icon: Users,
      countLabel: `${customers.length} Profiles`,
      badge: "Account Activity",
      color: "blue",
      onPdf: () => generateCustomersReport(customers, "pdf"),
      onExcel: () => generateCustomersReport(customers, "excel"),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Master Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#590d22] via-[#800f2f] to-[#a4133c] text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-pink-200 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Store Reporting & Audit Center</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold font-serif">
            Export Business Intelligence Reports
          </h3>
          <p className="text-xs sm:text-sm text-pink-100/90 mt-2 leading-relaxed">
            Generate pixel-perfect PDF documents with official Bajaj karyana
            Store branding or download high-precision Excel (.xlsx) spreadsheets
            formatted for accounting and inventory auditing.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                handleDownload("master-excel", exportMasterExcelWorkbook)
              }
              disabled={downloading !== null}
              className="inline-flex items-center gap-2 bg-white text-[#590d22] hover:bg-rose-50 px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition disabled:opacity-50"
            >
              {downloading === "master-excel" ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#800f2f]" />
              ) : (
                <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              )}
              <span>Download Master Audit (All-in-One Excel)</span>
            </button>
          </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-white/10 to-transparent pointer-events-none" />
      </div>

      {/* Grid of Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reportCards.map((card) => {
          const Icon = card.icon;
          const isPdfBusy = downloading === `${card.id}-pdf`;
          const isExcelBusy = downloading === `${card.id}-excel`;

          return (
            <div
              key={card.id}
              className="bg-white rounded-3xl border border-rose-100 p-5 sm:p-6 shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-200/80 text-[#800f2f] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700">
                      {card.countLabel}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-rose-50 text-[#800f2f] border border-rose-200/60">
                      {card.badge}
                    </span>
                  </div>
                </div>

                <h4 className="text-base font-bold text-[#590d22]">
                  {card.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-5 mt-4 border-t border-rose-50 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleDownload(`${card.id}-pdf`, card.onPdf)}
                  disabled={downloading !== null}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100/60 text-[#800f2f] font-bold text-xs transition disabled:opacity-50"
                >
                  {isPdfBusy ? (
                    <Loader2 className="w-4 h-4 animate-spin text-rose-700" />
                  ) : (
                    <FileText className="w-4 h-4 text-rose-700" />
                  )}
                  <span>{isPdfBusy ? "Generating..." : "Download PDF"}</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDownload(`${card.id}-excel`, card.onExcel)
                  }
                  disabled={downloading !== null}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/60 text-emerald-800 font-bold text-xs transition disabled:opacity-50"
                >
                  {isExcelBusy ? (
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
                  ) : (
                    <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                  )}
                  <span>{isExcelBusy ? "Exporting..." : "Download Excel"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
