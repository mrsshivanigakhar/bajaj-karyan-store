"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Boxes,
  Users,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Store,
  FileBarChart,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Categories", href: "/admin/categories", icon: Layers },
    { label: "Inventory", href: "/admin/inventory", icon: Boxes },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Reports & Export", href: "/admin/reports", icon: FileBarChart },
    { label: "Store Settings", href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const NavContent = () => (
    <div className="flex flex-col h-full bg-[#590d22] text-white">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#800f2f]">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#800f2f] flex items-center justify-center text-pink-300 shadow-xs">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-wider font-serif uppercase block leading-tight">
              BAJAJ karyana
            </span>
            <span className="text-[10px] text-pink-300 uppercase tracking-widest font-semibold">
              Admin Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Nav links */}
      <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive
                  ? "bg-[#800f2f] text-white shadow-sm border border-pink-400/20"
                  : "text-rose-200/80 hover:bg-[#800f2f]/50 hover:text-white"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${isActive ? "text-pink-400" : "text-rose-300"}`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer links */}
      <div className="p-4 border-t border-[#800f2f] space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between w-full px-3.5 py-2 rounded-xl text-xs font-medium text-rose-200 hover:text-white hover:bg-[#800f2f]/50 transition"
        >
          <span className="flex items-center gap-2">
            <Store className="w-4 h-4 text-pink-400" />
            <span>View Public Store</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-rose-300" />
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3.5 py-2 rounded-xl text-xs font-medium text-red-300 hover:text-red-100 hover:bg-red-950/40 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-3 left-4 z-50">
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-[#590d22] text-white shadow-md"
          aria-label="Toggle admin sidebar"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 shadow-lg">
        <NavContent />
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-64 max-w-xs h-full z-50 shadow-2xl">
            <NavContent />
          </div>
        </div>
      )}
    </>
  );
}
