import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { navigateTo } from "../../utils/store";

interface AdminLayoutProps {
  activeTab: string;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeTab,
  title,
  subtitle,
  actions,
  children,
}) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigationGroups = [
    {
      group: "Core",
      items: [
        { id: "dashboard", label: "Dashboard", icon: "📊", path: "/admin", permission: "view dashboard" },
        { id: "reports", label: "Analytics & Reports", icon: "📈", path: "/admin/reports", permission: "view dashboard" },
      ],
    },
    {
      group: "Catalog",
      items: [
        { id: "products", label: "Products", icon: "🏷️", path: "/admin/products", permission: "view products" },
        { id: "categories", label: "Categories", icon: "📁", path: "/admin/categories", permission: "view categories" },
        { id: "brands", label: "Brands", icon: "💎", path: "/admin/brands", permission: "view brands" },
        { id: "attributes", label: "Attributes", icon: "🎨", path: "/admin/attributes", permission: "view products" },
      ],
    },
    {
      group: "Operations",
      items: [
        { id: "orders", label: "Orders", icon: "📦", path: "/admin/orders", permission: "view orders" },
        { id: "inventory", label: "Inventory & Audit", icon: "📋", path: "/admin/inventory", permission: "view inventory" },
        { id: "payments", label: "Payments", icon: "💳", path: "/admin/payments", permission: "view orders" },
        { id: "customers", label: "Customers", icon: "👥", path: "/admin/customers", permission: "view customers" },
      ],
    },
    {
      group: "Marketing & Content",
      items: [
        { id: "blogs", label: "Blog & Editorial", icon: "📝", path: "/admin/blogs", permission: "view dashboard" },
        { id: "coupons", label: "Coupons", icon: "🎟️", path: "/admin/coupons", permission: "view coupons" },
        { id: "reviews", label: "Reviews Moderation", icon: "⭐", path: "/admin/reviews", permission: "view reviews" },
      ],
    },
    {
      group: "System & Settings",
      items: [
        { id: "shipping", label: "Shipping Methods", icon: "🚚", path: "/admin/shipping", permission: "manage settings" },
        { id: "users", label: "Staff & Users", icon: "👤", path: "/admin/users", permission: "manage users" },
        { id: "roles", label: "Roles & Permissions", icon: "🔐", path: "/admin/roles", permission: "manage roles" },
        { id: "settings", label: "Store Settings", icon: "⚙️", path: "/admin/settings", permission: "view settings" },
      ],
    },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo(`/admin/orders?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isSuperAdmin = user?.roles?.includes("Super Admin");

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col md:flex-row text-neutral-900 font-sans">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-neutral-950 text-neutral-300 transform transition-transform duration-300 md:relative md:translate-x-0 flex flex-col ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="cursor-pointer flex items-center gap-2" onClick={() => navigateTo("/admin")}>
            <span className="font-mono text-lg font-extrabold tracking-widest text-red-500">NOTHING</span>
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded">
              Ops Hub
            </span>
          </div>
          <button className="md:hidden text-neutral-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
            ✕
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          {navigationGroups.map((grp) => {
            const visibleItems = grp.items.filter((item) => {
              if (isSuperAdmin) return true;
              return user?.permissions?.includes(item.permission);
            });

            if (visibleItems.length === 0) return null;

            return (
              <div key={grp.group}>
                <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">
                  {grp.group}
                </p>
                <div className="space-y-0.5">
                  {visibleItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigateTo(item.path);
                        }}
                        className={`w-full flex items-center gap-3 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all text-left ${
                          isActive
                            ? "bg-red-600 text-white shadow-sm font-bold"
                            : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                        }`}
                      >
                        <span className="text-sm">{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900/60">
          <div className="flex items-center justify-between text-xs">
            <div className="min-w-0 pr-2">
              <p className="font-bold text-white truncate">{user?.name || "Admin"}</p>
              <p className="text-[10px] text-neutral-400 truncate">{user?.email}</p>
            </div>
            <button
              onClick={() => {
                logout();
                navigateTo("/login");
              }}
              className="px-2 py-1 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded text-[10px] font-bold"
            >
              Logout
            </button>
          </div>
          <button
            onClick={() => navigateTo("/")}
            className="w-full mt-3 py-1.5 text-[11px] font-semibold text-center bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded transition"
          >
            ← View Live Storefront
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-neutral-200 px-6 py-3.5 flex items-center justify-between gap-4 sticky top-0 z-40">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              className="md:hidden p-2 text-neutral-600 hover:text-black"
              onClick={() => setMobileMenuOpen(true)}
            >
              ☰
            </button>
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Global search orders, SKUs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-neutral-200 bg-neutral-50 focus:bg-white focus:border-black outline-none transition"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">🔍</span>
            </form>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Store Online
            </span>
          </div>
        </header>

        {/* Page Header (if provided) */}
        {(title || actions) && (
          <div className="px-6 md:px-8 pt-6 pb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900 capitalize">
                {title || activeTab}
              </h1>
              {subtitle && <p className="text-xs text-neutral-500 mt-1">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        )}

        {/* Page Content Container */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
