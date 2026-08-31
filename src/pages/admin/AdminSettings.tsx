import React, { useEffect, useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { adminApi } from "../../api/admin";
import { productsApi, Product } from "../../api/products";
import { ImageUpload } from "../../components/admin/common/ImageUpload";
import {
  HeaderMenuItem,
  HeaderActionsSettings,
  AnnouncementBarSettings,
  TrustBadgeItem,
  TrustBarSettings,
  DeviceModelItem,
  DeviceModelsSettings,
  FlashSaleSettings,
  BrandStoryStat,
  BrandStoryCard,
  BrandStorySettings,
  ReviewItem,
  ReviewsSectionSettings,
  settingsApi,
} from "../../api/settings";

type SettingsTab = "header" | "deals" | "models" | "story" | "reviews" | "trust" | "store" | "shipping" | "payments";

const DEFAULT_MENU: HeaderMenuItem[] = [
  { id: "m-1", label: "Shop", path: "/shop", is_active: true },
  { id: "m-2", label: "Buying Guide", path: "/buying-guide", is_active: true },
  { id: "m-3", label: "Compare", path: "/compare", is_active: true },
  { id: "m-4", label: "Reviews", path: "/reviews", is_active: true },
  { id: "m-5", label: "Blog", path: "/blog", is_active: true },
];

const DEFAULT_ACTIONS: HeaderActionsSettings = {
  show_search: true,
  show_wishlist: true,
  show_account: true,
  show_cart: true,
  cta_button: {
    show: true,
    text: "Shop Now",
    link: "/shop",
  },
};

const DEFAULT_ANNOUNCEMENT: AnnouncementBarSettings = {
  show: false,
  text: "⚡ Free delivery across Pakistan on all orders above Rs. 3,000!",
  link: "/shop",
  bg_color: "#0A0A0A",
  text_color: "#FFFFFF",
};

const DEFAULT_TRUST_ITEMS: TrustBadgeItem[] = [
  { id: "t-1", icon: "🚀", label: "Express Delivery", sub: "1–3 Days Nationwide", is_active: true },
  { id: "t-2", icon: "💎", label: "Premium Quality", sub: "Verified Authentic", is_active: true },
  { id: "t-3", icon: "💰", label: "Best Prices", sub: "Price Match Guarantee", is_active: true },
  { id: "t-4", icon: "🔒", label: "Secure Shopping", sub: "256-bit SSL Encrypted", is_active: true },
  { id: "t-5", icon: "💬", label: "24/7 Support", sub: "WhatsApp & Live Chat", is_active: true },
];

const DEFAULT_TRUST_BAR: TrustBarSettings = {
  show: true,
  bg_color: "#0A0A0A",
  text_color: "#FFFFFF",
  sub_text_color: "#6B6B6B",
  border_color: "#2A2A2A",
  items: DEFAULT_TRUST_ITEMS,
};

const DEFAULT_DEVICE_MODELS: DeviceModelItem[] = [
  { id: "m-1", name: "Phone (1)", year: "2022", brand: "Nothing", color: "#1A1A1A", is_active: true },
  { id: "m-2", name: "Phone (2)", year: "2023", brand: "Nothing", color: "#0A0A0A", is_active: true },
  { id: "m-3", name: "Phone (2a)", year: "2024", brand: "Nothing", color: "#2A2A2A", is_active: true },
  { id: "m-4", name: "Phone (2a) Plus", year: "2024", brand: "Nothing", color: "#111111", is_active: true },
  { id: "m-5", name: "Phone (3a)", year: "2025", brand: "Nothing", color: "#0A0A0A", is_active: true },
  { id: "m-6", name: "CMF Phone 1", year: "2024", brand: "CMF", color: "#E53528", is_active: true },
  { id: "m-7", name: "CMF Phone 2", year: "2025", brand: "CMF", color: "#E53528", is_active: true },
];

const DEFAULT_DEVICE_SETTINGS: DeviceModelsSettings = {
  show: true,
  title: "Choose Your Model",
  subtitle: "Find accessories perfectly matched to your Nothing or CMF device.",
  badge: "Device Lineup",
  items: DEFAULT_DEVICE_MODELS,
};

const DEFAULT_FLASH_SALE: FlashSaleSettings = {
  show: true,
  badge: "Limited Time",
  title: "Flash Deals",
  highlight: "Up to 40% Off",
  description: "Exclusive limited-time offers on premium Nothing & CMF accessories. Don't miss out — prices reset daily.",
  countdown_hours: 12,
  cta_text: "View All Deals",
  cta_link: "/shop?deal=true",
  bg_color: "#FFF5F4",
  product_ids: [],
};

const DEFAULT_BRAND_STORY: BrandStorySettings = {
  show: true,
  heading_line1: "Built for",
  heading_highlight: "Nothing.",
  heading_line2: "Made for Pakistan.",
  description:
    "We started Nothing Accessories because Pakistani Nothing users deserved better. No counterfeit products, no inflated prices, no waiting weeks for delivery. Just premium accessories, verified authentic, at your door in days.",
  stats: [
    { id: "s-1", num: "3+", label: "Years Serving Pakistan" },
    { id: "s-2", num: "15K+", label: "Happy Customers" },
    { id: "s-3", num: "500+", label: "SKUs Available" },
  ],
  cards: [
    { id: "c-1", label: "Cases", type: "case", image: "", link: "/shop?category=phone-cases" },
    { id: "c-2", label: "Audio", type: "audio", image: "", link: "/shop?category=mobile-accessories" },
    { id: "c-3", label: "Chargers", type: "charger", image: "", link: "/shop?category=mobile-accessories" },
    { id: "c-4", label: "Power", type: "power", image: "", link: "/shop?category=mobile-accessories" },
  ],
  bg_color: "#0A0A0A",
  accent_color: "#E53528",
};

const DEFAULT_REVIEWS_ITEMS: ReviewItem[] = [
  {
    id: "r-1",
    name: "Ahmed K.",
    city: "Karachi",
    rating: 5,
    text: "Ordered a case for my Nothing Phone 2 — arrived next day, perfect fit, quality is unreal. Finally a store that gets it right.",
    product: "Nothing Phone (2) Clear Case",
    is_verified: true,
    is_active: true,
  },
  {
    id: "r-2",
    name: "Fatima S.",
    city: "Lahore",
    rating: 5,
    text: "The CMF Buds Pro are insane value. Sound quality blew my mind. Delivery was super fast too. Highly recommend this store!",
    product: "CMF Buds Pro 2",
    is_verified: true,
    is_active: true,
  },
  {
    id: "r-3",
    name: "Usman R.",
    city: "Islamabad",
    rating: 5,
    text: "65W charger is legit. Charges my Nothing 2 from 0 to 100 in under an hour. No fake charging specs here.",
    product: "65W GaN Charger",
    is_verified: true,
    is_active: true,
  },
  {
    id: "r-4",
    name: "Sara M.",
    city: "Faisalabad",
    rating: 4,
    text: "Great case, lovely packaging. Looks just like the official product. Will definitely order again.",
    product: "Nothing Phone (2a) Case",
    is_verified: true,
    is_active: true,
  },
  {
    id: "r-5",
    name: "Bilal H.",
    city: "Peshawar",
    rating: 5,
    text: "The power bank quality exceeded my expectations. WhatsApp support was amazing when I had a question.",
    product: "CMF PowerBank 10000",
    is_verified: true,
    is_active: true,
  },
  {
    id: "r-6",
    name: "Zara N.",
    city: "Multan",
    rating: 5,
    text: "Best Nothing accessories store in Pakistan, period. Fast, authentic, and competitively priced. 10/10!",
    product: "Nothing Phone (3a) Bundle",
    is_verified: true,
    is_active: true,
  },
];

const DEFAULT_REVIEWS_SETTINGS: ReviewsSectionSettings = {
  show: true,
  badge: "Customer Love",
  title: "What Customers Say",
  rating_score: "4.9",
  rating_text: "4.9 / 5 from 2,400+ verified Pakistani reviews",
  items: DEFAULT_REVIEWS_ITEMS,
};

export const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("header");
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [newMenuLabel, setNewMenuLabel] = useState("");
  const [newMenuPath, setNewMenuPath] = useState("");

  const [newTrustIcon, setNewTrustIcon] = useState("🛡️");
  const [newTrustLabel, setNewTrustLabel] = useState("");
  const [newTrustSub, setNewTrustSub] = useState("");

  const [newModelName, setNewModelName] = useState("");
  const [newModelYear, setNewModelYear] = useState("2025");
  const [newModelBrand, setNewModelBrand] = useState("Nothing");
  const [newModelColor, setNewModelColor] = useState("#0A0A0A");

  // New review form state
  const [newRevName, setNewRevName] = useState("");
  const [newRevCity, setNewRevCity] = useState("Karachi");
  const [newRevProduct, setNewRevProduct] = useState("");
  const [newRevRating, setNewRevRating] = useState(5);
  const [newRevText, setNewRevText] = useState("");
  const [newRevVerified, setNewRevVerified] = useState(true);

  const [productSearch, setProductSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [res, productsRes] = await Promise.all([
        adminApi.getSettings().catch(() => []),
        productsApi.getProducts({ per_page: 50 }).catch(() => ({ data: [] })),
      ]);

      const map: Record<string, any> = {};
      (res || []).forEach((item: any) => {
        let val = item.value;
        try {
          if (typeof val === "string" && (val.startsWith("{") || val.startsWith("["))) {
            val = JSON.parse(val);
          }
        } catch {
          // ignore
        }
        map[item.key] = val;
      });
      setSettings(map);
      setAllProducts(productsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // Helpers
  const menuItems: HeaderMenuItem[] = Array.isArray(settings.header_menu)
    ? settings.header_menu
    : DEFAULT_MENU;

  const headerActions: HeaderActionsSettings = settings.header_actions
    ? { ...DEFAULT_ACTIONS, ...settings.header_actions }
    : DEFAULT_ACTIONS;

  const announcementBar: AnnouncementBarSettings = settings.announcement_bar
    ? { ...DEFAULT_ANNOUNCEMENT, ...settings.announcement_bar }
    : DEFAULT_ANNOUNCEMENT;

  const trustBar: TrustBarSettings = settings.trust_bar_settings
    ? { ...DEFAULT_TRUST_BAR, ...settings.trust_bar_settings }
    : DEFAULT_TRUST_BAR;

  const trustItems: TrustBadgeItem[] = Array.isArray(trustBar.items) && trustBar.items.length > 0
    ? trustBar.items
    : DEFAULT_TRUST_ITEMS;

  const deviceSettings: DeviceModelsSettings = settings.device_models_settings
    ? { ...DEFAULT_DEVICE_SETTINGS, ...settings.device_models_settings }
    : DEFAULT_DEVICE_SETTINGS;

  const deviceModels: DeviceModelItem[] = Array.isArray(deviceSettings.items) && deviceSettings.items.length > 0
    ? deviceSettings.items
    : DEFAULT_DEVICE_MODELS;

  const flashSale: FlashSaleSettings = settings.flash_sale_settings
    ? { ...DEFAULT_FLASH_SALE, ...settings.flash_sale_settings }
    : DEFAULT_FLASH_SALE;

  const brandStory: BrandStorySettings = settings.brand_story_settings
    ? { ...DEFAULT_BRAND_STORY, ...settings.brand_story_settings }
    : DEFAULT_BRAND_STORY;

  const storyStats: BrandStoryStat[] = Array.isArray(brandStory.stats) && brandStory.stats.length > 0
    ? brandStory.stats
    : DEFAULT_BRAND_STORY.stats!;

  const storyCards: BrandStoryCard[] = Array.isArray(brandStory.cards) && brandStory.cards.length > 0
    ? brandStory.cards
    : DEFAULT_BRAND_STORY.cards!;

  const reviewsSection: ReviewsSectionSettings = settings.reviews_section_settings
    ? { ...DEFAULT_REVIEWS_SETTINGS, ...settings.reviews_section_settings }
    : DEFAULT_REVIEWS_SETTINGS;

  const reviewItems: ReviewItem[] = Array.isArray(reviewsSection.items) && reviewsSection.items.length > 0
    ? reviewsSection.items
    : DEFAULT_REVIEWS_ITEMS;

  // Menu helper
  const updateMenuItems = (newItems: HeaderMenuItem[]) => {
    handleChange("header_menu", newItems);
  };

  const addMenuItem = () => {
    if (!newMenuLabel.trim() || !newMenuPath.trim()) {
      alert("Please provide both Label and URL Path for the menu item.");
      return;
    }
    const newItem: HeaderMenuItem = {
      id: `menu-${Date.now()}`,
      label: newMenuLabel.trim(),
      path: newMenuPath.trim(),
      is_active: true,
    };
    updateMenuItems([...menuItems, newItem]);
    setNewMenuLabel("");
    setNewMenuPath("");
  };

  const removeMenuItem = (id: string) => {
    updateMenuItems(menuItems.filter((m) => m.id !== id));
  };

  const toggleMenuItem = (id: string) => {
    updateMenuItems(
      menuItems.map((m) => (m.id === id ? { ...m, is_active: !m.is_active } : m))
    );
  };

  const moveMenuItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= menuItems.length) return;
    const next = [...menuItems];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    updateMenuItems(next);
  };

  // Trust helper
  const updateTrustItems = (newItems: TrustBadgeItem[]) => {
    handleChange("trust_bar_settings", {
      ...trustBar,
      items: newItems,
    });
  };

  const addTrustItem = () => {
    if (!newTrustLabel.trim()) {
      alert("Please provide a Title/Label for the trust badge.");
      return;
    }
    const newItem: TrustBadgeItem = {
      id: `trust-${Date.now()}`,
      icon: newTrustIcon.trim() || "⭐",
      label: newTrustLabel.trim(),
      sub: newTrustSub.trim() || "Official Service",
      is_active: true,
    };
    updateTrustItems([...trustItems, newItem]);
    setNewTrustLabel("");
    setNewTrustSub("");
  };

  const removeTrustItem = (id: string) => {
    updateTrustItems(trustItems.filter((t) => t.id !== id));
  };

  const toggleTrustItem = (id: string) => {
    updateTrustItems(
      trustItems.map((t) => (t.id === id ? { ...t, is_active: !t.is_active } : t))
    );
  };

  const moveTrustItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= trustItems.length) return;
    const next = [...trustItems];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    updateTrustItems(next);
  };

  // Device Models Helpers
  const updateDeviceModels = (newItems: DeviceModelItem[]) => {
    handleChange("device_models_settings", {
      ...deviceSettings,
      items: newItems,
    });
  };

  const addDeviceModel = () => {
    if (!newModelName.trim()) {
      alert("Please provide a model name (e.g. Phone (2), CMF Phone 1).");
      return;
    }
    const newItem: DeviceModelItem = {
      id: `model-${Date.now()}`,
      name: newModelName.trim(),
      year: newModelYear.trim() || new Date().getFullYear().toString(),
      brand: newModelBrand.trim() || "Nothing",
      color: newModelColor || "#0A0A0A",
      is_active: true,
    };
    updateDeviceModels([...deviceModels, newItem]);
    setNewModelName("");
  };

  const removeDeviceModel = (id: string) => {
    updateDeviceModels(deviceModels.filter((m) => m.id !== id));
  };

  const toggleDeviceModel = (id: string) => {
    updateDeviceModels(
      deviceModels.map((m) => (m.id === id ? { ...m, is_active: !m.is_active } : m))
    );
  };

  const moveDeviceModel = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= deviceModels.length) return;
    const next = [...deviceModels];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    updateDeviceModels(next);
  };

  // Flash Sale Helper
  const toggleFlashSaleProduct = (productId: number) => {
    const currentIds = Array.isArray(flashSale.product_ids) ? [...flashSale.product_ids] : [];
    const index = currentIds.indexOf(productId);
    if (index > -1) {
      currentIds.splice(index, 1);
    } else {
      currentIds.push(productId);
    }
    handleChange("flash_sale_settings", {
      ...flashSale,
      product_ids: currentIds,
    });
  };

  // Brand Story Helpers
  const updateStoryStats = (newStats: BrandStoryStat[]) => {
    handleChange("brand_story_settings", {
      ...brandStory,
      stats: newStats,
    });
  };

  const updateStoryCards = (newCards: BrandStoryCard[]) => {
    handleChange("brand_story_settings", {
      ...brandStory,
      cards: newCards,
    });
  };

  // Reviews Helpers
  const updateReviewItems = (newItems: ReviewItem[]) => {
    handleChange("reviews_section_settings", {
      ...reviewsSection,
      items: newItems,
    });
  };

  const addReviewItem = () => {
    if (!newRevName.trim() || !newRevText.trim()) {
      alert("Please provide customer name and review text.");
      return;
    }
    const newItem: ReviewItem = {
      id: `rev-${Date.now()}`,
      name: newRevName.trim(),
      city: newRevCity.trim() || "Pakistan",
      rating: newRevRating,
      product: newRevProduct.trim() || "Nothing Accessories",
      text: newRevText.trim(),
      is_verified: newRevVerified,
      is_active: true,
    };
    updateReviewItems([...reviewItems, newItem]);
    setNewRevName("");
    setNewRevProduct("");
    setNewRevText("");
  };

  const removeReviewItem = (id: string) => {
    updateReviewItems(reviewItems.filter((r) => r.id !== id));
  };

  const toggleReviewItem = (id: string) => {
    updateReviewItems(
      reviewItems.map((r) => (r.id === id ? { ...r, is_active: !r.is_active } : r))
    );
  };

  const moveReviewItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= reviewItems.length) return;
    const next = [...reviewItems];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    updateReviewItems(next);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const payload = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
        group:
          ["site_logo", "site_logo_alt", "header_menu", "header_actions", "announcement_bar"].includes(key)
            ? "header"
            : ["trust_bar_settings", "device_models_settings", "flash_sale_settings", "brand_story_settings", "reviews_section_settings"].includes(key)
            ? "appearance"
            : ["free_shipping_threshold", "default_delivery_fee"].includes(key)
            ? "shipping"
            : ["currency", "currency_symbol", "cod_enabled", "tax_percentage"].includes(key)
            ? "payment"
            : "store",
      }));

      await adminApi.updateSettings(payload);
      settingsApi.saveSettingsCache(settings as any);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      alert("Settings saved successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const filteredCatalogProducts = allProducts.filter((p) =>
    (p.name || "").toLowerCase().includes(productSearch.toLowerCase()) ||
    (p.category?.name || "").toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <AdminLayout activeTab="settings">
      <div className="space-y-6 max-w-5xl">
        {/* Page Header */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Dynamic Store & Appearance Customizer</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Customize website header, customer reviews, brand story, flash deals, device lineup, and store settings.
            </p>
          </div>
          {saveSuccess && (
            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">
              Changes Saved ✓
            </span>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 border-b border-neutral-200 pb-2 overflow-x-auto">
          {[
            { id: "header", label: "🎨 Header & Navigation", desc: "Logo, Menu, Buttons" },
            { id: "deals", label: "⚡ Flash Sale & Deals", desc: "Countdown, Banner, Products" },
            { id: "models", label: "📱 Device Models", desc: "Phone (1), (2), CMF" },
            { id: "story", label: "📖 Brand Story", desc: "Built for Nothing Section" },
            { id: "reviews", label: "⭐ Customer Reviews", desc: "Testimonials & Ratings" },
            { id: "trust", label: "🛡️ Trust Badges", desc: "Express Delivery, Guarantee" },
            { id: "store", label: "🏢 Store Details", desc: "Contact & Info" },
            { id: "shipping", label: "🚚 Shipping & COD", desc: "Delivery Rates" },
            { id: "payments", label: "💳 Payments & Currency", desc: "PKR & Options" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-neutral-900 text-white shadow-sm"
                  : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 bg-white rounded-2xl border">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-red-600" />
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            {/* ════════════════════════════════════════════════════════
                TAB 1: HEADER & NAVIGATION CUSTOMIZER
            ════════════════════════════════════════════════════════ */}
            {activeTab === "header" && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                  <div className="border-b pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-neutral-900">Website Header Logo</h3>
                      <p className="text-xs text-neutral-500">Upload your store logo from PC. SVG, PNG, or WebP recommended.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <ImageUpload
                      label="Header Logo (Upload from PC)"
                      value={settings.site_logo || ""}
                      onChange={(url) => handleChange("site_logo", url)}
                      folder="branding"
                    />
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">
                          Logo Alt Text (for Google SEO)
                        </label>
                        <input
                          type="text"
                          value={settings.site_logo_alt || ""}
                          onChange={(e) => handleChange("site_logo_alt", e.target.value)}
                          placeholder="e.g. Nothing Accessories Pakistan"
                          className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:border-black"
                        />
                      </div>
                      <div className="p-3 bg-neutral-50 rounded-xl border text-xs text-neutral-600">
                        <p className="font-bold mb-1">Logo Preview:</p>
                        {settings.site_logo ? (
                          <div className="p-3 bg-white rounded-lg border flex items-center justify-center max-w-[200px] h-12">
                            <img
                              src={settings.site_logo}
                              alt={settings.site_logo_alt || "Logo"}
                              className="max-h-8 max-w-full object-contain"
                            />
                          </div>
                        ) : (
                          <p className="text-neutral-400 italic">Default Nothing Accessories logo is currently active.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                  <div className="border-b pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-neutral-900">Navigation Menu Builder</h3>
                      <p className="text-xs text-neutral-500">Add, edit, reorder, or toggle header menu links.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateMenuItems(DEFAULT_MENU)}
                      className="px-3 py-1 text-xs font-semibold text-neutral-600 hover:text-black border rounded-lg hover:bg-neutral-50 cursor-pointer"
                    >
                      ↺ Reset to Default Menu
                    </button>
                  </div>

                  <div className="space-y-2">
                    {menuItems.map((item, idx) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-xl border flex items-center gap-3 transition ${
                          item.is_active ? "bg-white border-neutral-200" : "bg-neutral-50 border-neutral-200 opacity-60"
                        }`}
                      >
                        <div className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveMenuItem(idx, "up")}
                            className="text-[10px] p-0.5 hover:bg-neutral-200 rounded disabled:opacity-30 cursor-pointer"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            disabled={idx === menuItems.length - 1}
                            onClick={() => moveMenuItem(idx, "down")}
                            className="text-[10px] p-0.5 hover:bg-neutral-200 rounded disabled:opacity-30 cursor-pointer"
                          >
                            ▼
                          </button>
                        </div>

                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <span className="text-[10px] text-neutral-400 font-bold uppercase">Menu Label</span>
                            <input
                              type="text"
                              value={item.label}
                              onChange={(e) => {
                                const next = [...menuItems];
                                next[idx].label = e.target.value;
                                updateMenuItems(next);
                              }}
                              className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-semibold"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-neutral-400 font-bold uppercase">Destination URL / Path</span>
                            <input
                              type="text"
                              value={item.path}
                              onChange={(e) => {
                                const next = [...menuItems];
                                next[idx].path = e.target.value;
                                updateMenuItems(next);
                              }}
                              className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-mono"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleMenuItem(item.id)}
                            className={`px-2.5 py-1 text-xs font-bold rounded-lg border cursor-pointer ${
                              item.is_active
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-neutral-200 text-neutral-600 border-neutral-300"
                            }`}
                          >
                            {item.is_active ? "Active" : "Hidden"}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeMenuItem(item.id)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer text-sm"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-neutral-50 rounded-xl border border-dashed border-neutral-300 space-y-3">
                    <p className="text-xs font-bold text-neutral-700">+ Add New Header Link</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Link Label (e.g. Deals & Offers)"
                        value={newMenuLabel}
                        onChange={(e) => setNewMenuLabel(e.target.value)}
                        className="px-3 py-2 border rounded-xl text-xs bg-white"
                      />
                      <input
                        type="text"
                        placeholder="URL Path (e.g. /shop?deal=true)"
                        value={newMenuPath}
                        onChange={(e) => setNewMenuPath(e.target.value)}
                        className="px-3 py-2 border rounded-xl text-xs bg-white font-mono"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addMenuItem}
                      className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Add to Header Menu
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                  <div className="border-b pb-3">
                    <h3 className="font-bold text-sm text-neutral-900">Header Action Buttons & Custom CTA</h3>
                    <p className="text-xs text-neutral-500">Enable, disable, or modify header utility buttons and primary CTA.</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { key: "show_search", label: "🔍 Search Icon" },
                      { key: "show_wishlist", label: "🤍 Wishlist Icon" },
                      { key: "show_account", label: "👤 Account Icon" },
                      { key: "show_cart", label: "🛒 Cart Drawer" },
                    ].map((btn) => (
                      <label
                        key={btn.key}
                        className="p-3 bg-neutral-50 rounded-xl border flex items-center justify-between cursor-pointer hover:bg-neutral-100 transition"
                      >
                        <span className="text-xs font-bold text-neutral-800">{btn.label}</span>
                        <input
                          type="checkbox"
                          checked={Boolean((headerActions as any)[btn.key])}
                          onChange={(e) => {
                            handleChange("header_actions", {
                              ...headerActions,
                              [btn.key]: e.target.checked,
                            });
                          }}
                          className="h-4 w-4 rounded accent-black"
                        />
                      </label>
                    ))}
                  </div>

                  <div className="p-4 bg-neutral-50 rounded-xl border space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-neutral-900">Custom Header Action Button</p>
                        <p className="text-[11px] text-neutral-500">A high-visibility CTA button displayed on desktop header</p>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-800">
                        <input
                          type="checkbox"
                          checked={Boolean(headerActions.cta_button?.show)}
                          onChange={(e) => {
                            handleChange("header_actions", {
                              ...headerActions,
                              cta_button: {
                                ...headerActions.cta_button,
                                show: e.target.checked,
                              },
                            });
                          }}
                          className="h-4 w-4 rounded accent-red-600"
                        />
                        Enable CTA Button
                      </label>
                    </div>

                    {headerActions.cta_button?.show && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">Button Text</label>
                          <input
                            type="text"
                            value={headerActions.cta_button.text || ""}
                            onChange={(e) => {
                              handleChange("header_actions", {
                                ...headerActions,
                                cta_button: {
                                  ...headerActions.cta_button,
                                  text: e.target.value,
                                },
                              });
                            }}
                            placeholder="e.g. Shop Now / Explore Gear"
                            className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">Destination URL</label>
                          <input
                            type="text"
                            value={headerActions.cta_button.link || ""}
                            onChange={(e) => {
                              handleChange("header_actions", {
                                ...headerActions,
                                cta_button: {
                                  ...headerActions.cta_button,
                                  link: e.target.value,
                                },
                              });
                            }}
                            placeholder="e.g. /shop"
                            className="w-full px-3 py-2 border rounded-xl text-xs bg-white font-mono"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                  <div className="border-b pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-neutral-900">Top Announcement Banner</h3>
                      <p className="text-xs text-neutral-500">Display a top banner for discounts, sales, or delivery notices.</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-800">
                      <input
                        type="checkbox"
                        checked={Boolean(announcementBar.show)}
                        onChange={(e) => {
                          handleChange("announcement_bar", {
                            ...announcementBar,
                            show: e.target.checked,
                          });
                        }}
                        className="h-4 w-4 rounded accent-black"
                      />
                      Show Announcement Bar
                    </label>
                  </div>

                  {announcementBar.show && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">Banner Announcement Text</label>
                        <input
                          type="text"
                          value={announcementBar.text || ""}
                          onChange={(e) => {
                            handleChange("announcement_bar", {
                              ...announcementBar,
                              text: e.target.value,
                            });
                          }}
                          placeholder="e.g. ⚡ Free courier delivery across Pakistan on orders above Rs. 3,000!"
                          className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-neutral-700 mb-1">Click URL (Optional)</label>
                          <input
                            type="text"
                            value={announcementBar.link || ""}
                            onChange={(e) => {
                              handleChange("announcement_bar", {
                                ...announcementBar,
                                link: e.target.value,
                              });
                            }}
                            placeholder="/shop"
                            className="w-full px-3 py-2 border rounded-xl text-xs font-mono bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-neutral-700 mb-1">Background Color</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={announcementBar.bg_color || "#0A0A0A"}
                              onChange={(e) => {
                                handleChange("announcement_bar", {
                                  ...announcementBar,
                                  bg_color: e.target.value,
                                });
                              }}
                              className="h-9 w-9 rounded border cursor-pointer"
                            />
                            <span className="text-xs font-mono">{announcementBar.bg_color || "#0A0A0A"}</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-neutral-700 mb-1">Text Color</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={announcementBar.text_color || "#FFFFFF"}
                              onChange={(e) => {
                                handleChange("announcement_bar", {
                                  ...announcementBar,
                                  text_color: e.target.value,
                                });
                              }}
                              className="h-9 w-9 rounded border cursor-pointer"
                            />
                            <span className="text-xs font-mono">{announcementBar.text_color || "#FFFFFF"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════
                TAB 2: FLASH SALE & DEALS CUSTOMIZER
            ════════════════════════════════════════════════════════ */}
            {activeTab === "deals" && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                  <div className="border-b pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-neutral-900">Flash Deals & Limited Time Sale Controls</h3>
                      <p className="text-xs text-neutral-500">Configure left-side copywriting, countdown duration, and deals background.</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-800">
                      <input
                        type="checkbox"
                        checked={Boolean(flashSale.show)}
                        onChange={(e) => {
                          handleChange("flash_sale_settings", {
                            ...flashSale,
                            show: e.target.checked,
                          });
                        }}
                        className="h-4 w-4 rounded accent-red-600"
                      />
                      Enable Flash Sale Section
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Eyebrow Badge Text</label>
                      <input
                        type="text"
                        value={flashSale.badge || ""}
                        onChange={(e) => {
                          handleChange("flash_sale_settings", {
                            ...flashSale,
                            badge: e.target.value,
                          });
                        }}
                        placeholder="e.g. Limited Time"
                        className="w-full px-3 py-2 border rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Main Heading</label>
                      <input
                        type="text"
                        value={flashSale.title || ""}
                        onChange={(e) => {
                          handleChange("flash_sale_settings", {
                            ...flashSale,
                            title: e.target.value,
                          });
                        }}
                        placeholder="e.g. Flash Deals"
                        className="w-full px-3 py-2 border rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Highlight / Subheading (Red Accent)</label>
                      <input
                        type="text"
                        value={flashSale.highlight || ""}
                        onChange={(e) => {
                          handleChange("flash_sale_settings", {
                            ...flashSale,
                            highlight: e.target.value,
                          });
                        }}
                        placeholder="e.g. Up to 40% Off"
                        className="w-full px-3 py-2 border rounded-xl text-xs font-bold text-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Countdown Duration (Hours)</label>
                      <input
                        type="number"
                        min={1}
                        max={72}
                        value={flashSale.countdown_hours || 12}
                        onChange={(e) => {
                          handleChange("flash_sale_settings", {
                            ...flashSale,
                            countdown_hours: Number(e.target.value),
                          });
                        }}
                        className="w-full px-3 py-2 border rounded-xl text-xs font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Description Message</label>
                      <textarea
                        rows={2}
                        value={flashSale.description || ""}
                        onChange={(e) => {
                          handleChange("flash_sale_settings", {
                            ...flashSale,
                            description: e.target.value,
                          });
                        }}
                        placeholder="Exclusive limited-time offers on premium Nothing & CMF accessories..."
                        className="w-full px-3 py-2 border rounded-xl text-xs text-neutral-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">CTA Button Text</label>
                      <input
                        type="text"
                        value={flashSale.cta_text || ""}
                        onChange={(e) => {
                          handleChange("flash_sale_settings", {
                            ...flashSale,
                            cta_text: e.target.value,
                          });
                        }}
                        placeholder="View All Deals"
                        className="w-full px-3 py-2 border rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">CTA Button Link</label>
                      <input
                        type="text"
                        value={flashSale.cta_link || ""}
                        onChange={(e) => {
                          handleChange("flash_sale_settings", {
                            ...flashSale,
                            cta_link: e.target.value,
                          });
                        }}
                        placeholder="/shop?deal=true"
                        className="w-full px-3 py-2 border rounded-xl text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Section Background Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={flashSale.bg_color || "#FFF5F4"}
                          onChange={(e) => {
                            handleChange("flash_sale_settings", {
                              ...flashSale,
                              bg_color: e.target.value,
                            });
                          }}
                          className="h-9 w-9 rounded border cursor-pointer"
                        />
                        <span className="text-xs font-mono">{flashSale.bg_color || "#FFF5F4"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                  <div className="border-b pb-3 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-sm text-neutral-900">Featured Deal Products</h3>
                      <p className="text-xs text-neutral-500">
                        Select which products appear in the Flash Sale cards. ({Array.isArray(flashSale.product_ids) ? flashSale.product_ids.length : 0} Selected)
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="px-3 py-1.5 border rounded-xl text-xs w-48"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleChange("flash_sale_settings", {
                            ...flashSale,
                            product_ids: [],
                          })
                        }
                        className="px-2.5 py-1.5 text-xs text-neutral-500 hover:text-black border rounded-xl hover:bg-neutral-50 cursor-pointer"
                      >
                        Clear Selection (Auto)
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[420px] overflow-y-auto p-1">
                    {filteredCatalogProducts.map((prod) => {
                      const isSelected = Array.isArray(flashSale.product_ids) && flashSale.product_ids.includes(prod.id);
                      const price = Number(prod.sale_price ?? prod.price);
                      const oldPrice = prod.sale_price ? Number(prod.price) : 0;
                      const discount = oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

                      return (
                        <div
                          key={prod.id}
                          onClick={() => toggleFlashSaleProduct(prod.id)}
                          className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                            isSelected
                              ? "bg-red-50/50 border-red-500 ring-2 ring-red-500/20 shadow-xs"
                              : "bg-white border-neutral-200 hover:border-neutral-400"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="h-4 w-4 rounded accent-red-600 cursor-pointer"
                          />
                          {prod.images?.[0]?.image ? (
                            <img
                              src={prod.images[0].image}
                              alt={prod.name}
                              className="w-12 h-12 object-contain rounded-lg bg-neutral-50 p-1 border flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center text-lg flex-shrink-0">
                              📦
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-neutral-900 truncate">{prod.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-bold text-red-600">₨{price.toLocaleString()}</span>
                              {discount > 0 && (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-red-100 text-red-700 rounded">
                                  -{discount}%
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════
                TAB 3: DEVICE MODELS LINEUP CUSTOMIZER
            ════════════════════════════════════════════════════════ */}
            {activeTab === "models" && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                  <div className="border-b pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-neutral-900">Choose Your Model Section Controls</h3>
                      <p className="text-xs text-neutral-500">Configure title, subtitle, badge, and visibility of the device models section.</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-800">
                      <input
                        type="checkbox"
                        checked={Boolean(deviceSettings.show)}
                        onChange={(e) => {
                          handleChange("device_models_settings", {
                            ...deviceSettings,
                            show: e.target.checked,
                          });
                        }}
                        className="h-4 w-4 rounded accent-black"
                      />
                      Enable Section
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Eyebrow Badge Text</label>
                      <input
                        type="text"
                        value={deviceSettings.badge || ""}
                        onChange={(e) => {
                          handleChange("device_models_settings", {
                            ...deviceSettings,
                            badge: e.target.value,
                          });
                        }}
                        placeholder="e.g. Device Lineup"
                        className="w-full px-3 py-2 border rounded-xl text-xs"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Section Main Heading</label>
                      <input
                        type="text"
                        value={deviceSettings.title || ""}
                        onChange={(e) => {
                          handleChange("device_models_settings", {
                            ...deviceSettings,
                            title: e.target.value,
                          });
                        }}
                        placeholder="e.g. Choose Your Model"
                        className="w-full px-3 py-2 border rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Section Subtitle</label>
                      <input
                        type="text"
                        value={deviceSettings.subtitle || ""}
                        onChange={(e) => {
                          handleChange("device_models_settings", {
                            ...deviceSettings,
                            subtitle: e.target.value,
                          });
                        }}
                        placeholder="e.g. Find accessories perfectly matched to your Nothing or CMF device."
                        className="w-full px-3 py-2 border rounded-xl text-xs text-neutral-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                  <div className="border-b pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-neutral-900">Supported Device Models</h3>
                      <p className="text-xs text-neutral-500">Add, edit, reorder, or toggle device models available for filtering.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateDeviceModels(DEFAULT_DEVICE_MODELS)}
                      className="px-3 py-1 text-xs font-semibold text-neutral-600 hover:text-black border rounded-lg hover:bg-neutral-50 cursor-pointer"
                    >
                      ↺ Reset to Default Models
                    </button>
                  </div>

                  <div className="space-y-3">
                    {deviceModels.map((item, idx) => (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-xl border flex items-center gap-3 transition ${
                          item.is_active ? "bg-white border-neutral-200 shadow-2xs" : "bg-neutral-50 border-neutral-200 opacity-60"
                        }`}
                      >
                        <div className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveDeviceModel(idx, "up")}
                            className="text-[10px] p-0.5 hover:bg-neutral-200 rounded disabled:opacity-30 cursor-pointer"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            disabled={idx === deviceModels.length - 1}
                            onClick={() => moveDeviceModel(idx, "down")}
                            className="text-[10px] p-0.5 hover:bg-neutral-200 rounded disabled:opacity-30 cursor-pointer"
                          >
                            ▼
                          </button>
                        </div>

                        <div className="flex-1">
                          <span className="text-[10px] text-neutral-400 font-bold uppercase">Model Name</span>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => {
                              const next = [...deviceModels];
                              next[idx].name = e.target.value;
                              updateDeviceModels(next);
                            }}
                            className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-bold"
                          />
                        </div>

                        <div className="w-24">
                          <span className="text-[10px] text-neutral-400 font-bold uppercase">Year</span>
                          <input
                            type="text"
                            value={item.year}
                            onChange={(e) => {
                              const next = [...deviceModels];
                              next[idx].year = e.target.value;
                              updateDeviceModels(next);
                            }}
                            className="w-full px-2.5 py-1.5 border rounded-lg text-xs"
                          />
                        </div>

                        <div className="w-28">
                          <span className="text-[10px] text-neutral-400 font-bold uppercase">Brand</span>
                          <select
                            value={item.brand || "Nothing"}
                            onChange={(e) => {
                              const next = [...deviceModels];
                              next[idx].brand = e.target.value;
                              updateDeviceModels(next);
                            }}
                            className="w-full px-2 py-1.5 border rounded-lg text-xs bg-white"
                          >
                            <option value="Nothing">Nothing</option>
                            <option value="CMF">CMF</option>
                          </select>
                        </div>

                        <div className="w-16">
                          <span className="text-[10px] text-neutral-400 font-bold uppercase">Theme</span>
                          <div className="flex items-center gap-1 mt-1">
                            <input
                              type="color"
                              value={item.color || "#0A0A0A"}
                              onChange={(e) => {
                                const next = [...deviceModels];
                                next[idx].color = e.target.value;
                                updateDeviceModels(next);
                              }}
                              className="h-7 w-7 rounded border cursor-pointer"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleDeviceModel(item.id)}
                            className={`px-2.5 py-1 text-xs font-bold rounded-lg border cursor-pointer ${
                              item.is_active
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-neutral-200 text-neutral-600 border-neutral-300"
                            }`}
                          >
                            {item.is_active ? "Active" : "Hidden"}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeDeviceModel(item.id)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer text-sm"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-neutral-50 rounded-xl border border-dashed border-neutral-300 space-y-3">
                    <p className="text-xs font-bold text-neutral-700">+ Add New Supported Device Model</p>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                      <div className="sm:col-span-4">
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">Model Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Phone (3) / Ear (a)"
                          value={newModelName}
                          onChange={(e) => setNewModelName(e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl text-xs bg-white font-semibold"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">Release Year</label>
                        <input
                          type="text"
                          placeholder="2025"
                          value={newModelYear}
                          onChange={(e) => setNewModelYear(e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">Brand Line</label>
                        <select
                          value={newModelBrand}
                          onChange={(e) => setNewModelBrand(e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                        >
                          <option value="Nothing">Nothing</option>
                          <option value="CMF">CMF</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <button
                          type="button"
                          onClick={addDeviceModel}
                          className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl cursor-pointer"
                        >
                          Add Model
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════
                TAB 4: BRAND STORY ("BUILT FOR NOTHING") CUSTOMIZER
            ════════════════════════════════════════════════════════ */}
            {activeTab === "story" && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                  <div className="border-b pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-neutral-900">Brand Story & Showcase Controls</h3>
                      <p className="text-xs text-neutral-500">Configure headlines, mission description, and statistics counters.</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-800">
                      <input
                        type="checkbox"
                        checked={Boolean(brandStory.show)}
                        onChange={(e) => {
                          handleChange("brand_story_settings", {
                            ...brandStory,
                            show: e.target.checked,
                          });
                        }}
                        className="h-4 w-4 rounded accent-red-600"
                      />
                      Enable Section
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Headline Line 1</label>
                      <input
                        type="text"
                        value={brandStory.heading_line1 || ""}
                        onChange={(e) => {
                          handleChange("brand_story_settings", {
                            ...brandStory,
                            heading_line1: e.target.value,
                          });
                        }}
                        placeholder="Built for"
                        className="w-full px-3 py-2 border rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Highlight Word (Red Accent)</label>
                      <input
                        type="text"
                        value={brandStory.heading_highlight || ""}
                        onChange={(e) => {
                          handleChange("brand_story_settings", {
                            ...brandStory,
                            heading_highlight: e.target.value,
                          });
                        }}
                        placeholder="Nothing."
                        className="w-full px-3 py-2 border rounded-xl text-xs font-bold text-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Headline Line 2</label>
                      <input
                        type="text"
                        value={brandStory.heading_line2 || ""}
                        onChange={(e) => {
                          handleChange("brand_story_settings", {
                            ...brandStory,
                            heading_line2: e.target.value,
                          });
                        }}
                        placeholder="Made for Pakistan."
                        className="w-full px-3 py-2 border rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Mission / Story Description</label>
                      <textarea
                        rows={3}
                        value={brandStory.description || ""}
                        onChange={(e) => {
                          handleChange("brand_story_settings", {
                            ...brandStory,
                            description: e.target.value,
                          });
                        }}
                        placeholder="We started Nothing Accessories because Pakistani Nothing users deserved better..."
                        className="w-full px-3 py-2 border rounded-xl text-xs text-neutral-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Background Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={brandStory.bg_color || "#0A0A0A"}
                          onChange={(e) => {
                            handleChange("brand_story_settings", {
                              ...brandStory,
                              bg_color: e.target.value,
                            });
                          }}
                          className="h-9 w-9 rounded border cursor-pointer"
                        />
                        <span className="text-xs font-mono">{brandStory.bg_color || "#0A0A0A"}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Accent Red Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={brandStory.accent_color || "#E53528"}
                          onChange={(e) => {
                            handleChange("brand_story_settings", {
                              ...brandStory,
                              accent_color: e.target.value,
                            });
                          }}
                          className="h-9 w-9 rounded border cursor-pointer"
                        />
                        <span className="text-xs font-mono">{brandStory.accent_color || "#E53528"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                  <div className="border-b pb-3">
                    <h3 className="font-bold text-sm text-neutral-900">Key Statistics Counters</h3>
                    <p className="text-xs text-neutral-500">Edit the 3 milestone metrics displayed below the story.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {storyStats.map((stat, idx) => (
                      <div key={stat.id || idx} className="p-3.5 bg-neutral-50 rounded-xl border space-y-2">
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Stat Number</label>
                          <input
                            type="text"
                            value={stat.num}
                            onChange={(e) => {
                              const next = [...storyStats];
                              next[idx].num = e.target.value;
                              updateStoryStats(next);
                            }}
                            className="w-full px-3 py-1.5 border rounded-lg text-sm font-bold bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Metric Label</label>
                          <input
                            type="text"
                            value={stat.label}
                            onChange={(e) => {
                              const next = [...storyStats];
                              next[idx].label = e.target.value;
                              updateStoryStats(next);
                            }}
                            className="w-full px-3 py-1.5 border rounded-lg text-xs bg-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                  <div className="border-b pb-3">
                    <h3 className="font-bold text-sm text-neutral-900">Right-Side 4 Showcase Cards</h3>
                    <p className="text-xs text-neutral-500">Customize labels, visual types, destination links, or upload custom PC images.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {storyCards.map((card, idx) => (
                      <div key={card.id || idx} className="p-4 bg-neutral-50 rounded-xl border space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-neutral-900">Card #{idx + 1}: {card.label}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">Card Label</label>
                            <input
                              type="text"
                              value={card.label}
                              onChange={(e) => {
                                const next = [...storyCards];
                                next[idx].label = e.target.value;
                                updateStoryCards(next);
                              }}
                              className="w-full px-2.5 py-1.5 border rounded-lg text-xs bg-white font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">Default Visual</label>
                            <select
                              value={card.type || "case"}
                              onChange={(e) => {
                                const next = [...storyCards];
                                next[idx].type = e.target.value;
                                updateStoryCards(next);
                              }}
                              className="w-full px-2 py-1.5 border rounded-lg text-xs bg-white"
                            >
                              <option value="case">Phone Case</option>
                              <option value="audio">Earbuds & Audio</option>
                              <option value="charger">Fast Charger</option>
                              <option value="power">Power Bank</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">Click Link</label>
                          <input
                            type="text"
                            value={card.link || ""}
                            onChange={(e) => {
                              const next = [...storyCards];
                              next[idx].link = e.target.value;
                              updateStoryCards(next);
                            }}
                            placeholder="/shop?category=phone-cases"
                            className="w-full px-2.5 py-1.5 border rounded-lg text-xs bg-white font-mono"
                          />
                        </div>

                        <ImageUpload
                          label="Custom Image (Optional - overrides visual)"
                          value={card.image || ""}
                          onChange={(url) => {
                            const next = [...storyCards];
                            next[idx].image = url;
                            updateStoryCards(next);
                          }}
                          folder="brand-story"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════
                TAB 5: CUSTOMER REVIEWS & TESTIMONIALS CUSTOMIZER
            ════════════════════════════════════════════════════════ */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                {/* 1. Global Section & Rating Headline */}
                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                  <div className="border-b pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-neutral-900">Customer Reviews Section Controls</h3>
                      <p className="text-xs text-neutral-500">Configure title, overall rating score, and visibility on homepage.</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-800">
                      <input
                        type="checkbox"
                        checked={Boolean(reviewsSection.show)}
                        onChange={(e) => {
                          handleChange("reviews_section_settings", {
                            ...reviewsSection,
                            show: e.target.checked,
                          });
                        }}
                        className="h-4 w-4 rounded accent-red-600"
                      />
                      Enable Section
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Eyebrow Badge Text</label>
                      <input
                        type="text"
                        value={reviewsSection.badge || ""}
                        onChange={(e) => {
                          handleChange("reviews_section_settings", {
                            ...reviewsSection,
                            badge: e.target.value,
                          });
                        }}
                        placeholder="e.g. Customer Love"
                        className="w-full px-3 py-2 border rounded-xl text-xs"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Section Main Heading</label>
                      <input
                        type="text"
                        value={reviewsSection.title || ""}
                        onChange={(e) => {
                          handleChange("reviews_section_settings", {
                            ...reviewsSection,
                            title: e.target.value,
                          });
                        }}
                        placeholder="e.g. What Customers Say"
                        className="w-full px-3 py-2 border rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Overall Rating Subtitle Text</label>
                      <input
                        type="text"
                        value={reviewsSection.rating_text || ""}
                        onChange={(e) => {
                          handleChange("reviews_section_settings", {
                            ...reviewsSection,
                            rating_text: e.target.value,
                          });
                        }}
                        placeholder="e.g. 4.9 / 5 from 2,400+ verified Pakistani reviews"
                        className="w-full px-3 py-2 border rounded-xl text-xs text-neutral-700 font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Customer Reviews List & Management */}
                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                  <div className="border-b pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-neutral-900">Featured Customer Reviews ({reviewItems.length})</h3>
                      <p className="text-xs text-neutral-500">Edit, reorder, toggle visibility, or add new real customer reviews.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateReviewItems(DEFAULT_REVIEWS_ITEMS)}
                      className="px-3 py-1 text-xs font-semibold text-neutral-600 hover:text-black border rounded-lg hover:bg-neutral-50 cursor-pointer"
                    >
                      ↺ Reset to Default Reviews
                    </button>
                  </div>

                  {/* Reviews items list */}
                  <div className="space-y-3">
                    {reviewItems.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center gap-3 transition ${
                          item.is_active ? "bg-white border-neutral-200 shadow-2xs" : "bg-neutral-50 border-neutral-200 opacity-60"
                        }`}
                      >
                        <div className="flex items-center sm:flex-col gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveReviewItem(idx, "up")}
                            className="text-[10px] p-0.5 hover:bg-neutral-200 rounded disabled:opacity-30 cursor-pointer"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            disabled={idx === reviewItems.length - 1}
                            onClick={() => moveReviewItem(idx, "down")}
                            className="text-[10px] p-0.5 hover:bg-neutral-200 rounded disabled:opacity-30 cursor-pointer"
                          >
                            ▼
                          </button>
                        </div>

                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-2.5 w-full">
                          <div className="sm:col-span-3">
                            <span className="text-[10px] text-neutral-400 font-bold uppercase">Customer Name</span>
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => {
                                const next = [...reviewItems];
                                next[idx].name = e.target.value;
                                updateReviewItems(next);
                              }}
                              className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-bold"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <span className="text-[10px] text-neutral-400 font-bold uppercase">City</span>
                            <input
                              type="text"
                              value={item.city}
                              onChange={(e) => {
                                const next = [...reviewItems];
                                next[idx].city = e.target.value;
                                updateReviewItems(next);
                              }}
                              className="w-full px-2.5 py-1.5 border rounded-lg text-xs"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <span className="text-[10px] text-neutral-400 font-bold uppercase">Rating</span>
                            <select
                              value={item.rating}
                              onChange={(e) => {
                                const next = [...reviewItems];
                                next[idx].rating = Number(e.target.value);
                                updateReviewItems(next);
                              }}
                              className="w-full px-2 py-1.5 border rounded-lg text-xs bg-white text-amber-500 font-bold"
                            >
                              <option value={5}>★★★★★ (5)</option>
                              <option value={4}>★★★★☆ (4)</option>
                              <option value={3}>★★★☆☆ (3)</option>
                            </select>
                          </div>

                          <div className="sm:col-span-5">
                            <span className="text-[10px] text-neutral-400 font-bold uppercase">Product Purchased</span>
                            <input
                              type="text"
                              value={item.product}
                              onChange={(e) => {
                                const next = [...reviewItems];
                                next[idx].product = e.target.value;
                                updateReviewItems(next);
                              }}
                              className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-medium"
                            />
                          </div>

                          <div className="sm:col-span-12">
                            <span className="text-[10px] text-neutral-400 font-bold uppercase">Review Text / Comment</span>
                            <textarea
                              rows={2}
                              value={item.text}
                              onChange={(e) => {
                                const next = [...reviewItems];
                                next[idx].text = e.target.value;
                                updateReviewItems(next);
                              }}
                              className="w-full px-2.5 py-1.5 border rounded-lg text-xs text-neutral-700"
                            />
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleReviewItem(item.id)}
                            className={`px-2.5 py-1 text-xs font-bold rounded-lg border cursor-pointer ${
                              item.is_active
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-neutral-200 text-neutral-600 border-neutral-300"
                            }`}
                          >
                            {item.is_active ? "Active" : "Hidden"}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeReviewItem(item.id)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer text-sm"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add New Review Form */}
                  <div className="p-4 bg-neutral-50 rounded-xl border border-dashed border-neutral-300 space-y-3">
                    <p className="text-xs font-bold text-neutral-700">+ Add New Customer Review / Testimonial</p>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
                      <div className="sm:col-span-3">
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">Customer Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Daniyal A."
                          value={newRevName}
                          onChange={(e) => setNewRevName(e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl text-xs bg-white font-semibold"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">City</label>
                        <input
                          type="text"
                          placeholder="Karachi"
                          value={newRevCity}
                          onChange={(e) => setNewRevCity(e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">Rating</label>
                        <select
                          value={newRevRating}
                          onChange={(e) => setNewRevRating(Number(e.target.value))}
                          className="w-full px-2 py-2 border rounded-xl text-xs bg-white font-bold text-amber-500"
                        >
                          <option value={5}>★★★★★ (5 Stars)</option>
                          <option value={4}>★★★★☆ (4 Stars)</option>
                          <option value={3}>★★★☆☆ (3 Stars)</option>
                        </select>
                      </div>
                      <div className="sm:col-span-5">
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">Product Name</label>
                        <input
                          type="text"
                          placeholder="e.g. 65W GaN Fast Charger"
                          value={newRevProduct}
                          onChange={(e) => setNewRevProduct(e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                        />
                      </div>
                      <div className="sm:col-span-10">
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">Review Comment</label>
                        <textarea
                          rows={2}
                          placeholder="Write the customer testimonial here..."
                          value={newRevText}
                          onChange={(e) => setNewRevText(e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                        />
                      </div>
                      <div className="sm:col-span-2 pt-6">
                        <button
                          type="button"
                          onClick={addReviewItem}
                          className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl cursor-pointer"
                        >
                          Add Review
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════
                TAB 6: TRUST BADGES & MARQUEE CUSTOMIZER
            ════════════════════════════════════════════════════════ */}
            {activeTab === "trust" && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                  <div className="border-b pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-neutral-900">Trust Bar / Features Marquee Controls</h3>
                      <p className="text-xs text-neutral-500">Configure global visibility, colors, and styling of the homepage Trust Bar.</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-800">
                      <input
                        type="checkbox"
                        checked={Boolean(trustBar.show)}
                        onChange={(e) => {
                          handleChange("trust_bar_settings", {
                            ...trustBar,
                            show: e.target.checked,
                          });
                        }}
                        className="h-4 w-4 rounded accent-black"
                      />
                      Enable Trust Bar Section
                    </label>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Background Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={trustBar.bg_color || "#0A0A0A"}
                          onChange={(e) => {
                            handleChange("trust_bar_settings", {
                              ...trustBar,
                              bg_color: e.target.value,
                            });
                          }}
                          className="h-9 w-9 rounded border cursor-pointer"
                        />
                        <span className="text-xs font-mono">{trustBar.bg_color || "#0A0A0A"}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Title Text Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={trustBar.text_color || "#FFFFFF"}
                          onChange={(e) => {
                            handleChange("trust_bar_settings", {
                              ...trustBar,
                              text_color: e.target.value,
                            });
                          }}
                          className="h-9 w-9 rounded border cursor-pointer"
                        />
                        <span className="text-xs font-mono">{trustBar.text_color || "#FFFFFF"}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Subtitle Text Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={trustBar.sub_text_color || "#6B6B6B"}
                          onChange={(e) => {
                            handleChange("trust_bar_settings", {
                              ...trustBar,
                              sub_text_color: e.target.value,
                            });
                          }}
                          className="h-9 w-9 rounded border cursor-pointer"
                        />
                        <span className="text-xs font-mono">{trustBar.sub_text_color || "#6B6B6B"}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Divider Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={trustBar.border_color || "#2A2A2A"}
                          onChange={(e) => {
                            handleChange("trust_bar_settings", {
                              ...trustBar,
                              border_color: e.target.value,
                            });
                          }}
                          className="h-9 w-9 rounded border cursor-pointer"
                        />
                        <span className="text-xs font-mono">{trustBar.border_color || "#2A2A2A"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                  <div className="border-b pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-neutral-900">Trust Badges Builder</h3>
                      <p className="text-xs text-neutral-500">Edit badge emoji/icons, titles, subtitles, reorder, or toggle active status.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateTrustItems(DEFAULT_TRUST_ITEMS)}
                      className="px-3 py-1 text-xs font-semibold text-neutral-600 hover:text-black border rounded-lg hover:bg-neutral-50 cursor-pointer"
                    >
                      ↺ Reset to Default Badges
                    </button>
                  </div>

                  <div className="space-y-3">
                    {trustItems.map((item, idx) => (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-xl border flex items-center gap-3 transition ${
                          item.is_active ? "bg-white border-neutral-200 shadow-2xs" : "bg-neutral-50 border-neutral-200 opacity-60"
                        }`}
                      >
                        <div className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveTrustItem(idx, "up")}
                            className="text-[10px] p-0.5 hover:bg-neutral-200 rounded disabled:opacity-30 cursor-pointer"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            disabled={idx === trustItems.length - 1}
                            onClick={() => moveTrustItem(idx, "down")}
                            className="text-[10px] p-0.5 hover:bg-neutral-200 rounded disabled:opacity-30 cursor-pointer"
                          >
                            ▼
                          </button>
                        </div>

                        <div className="w-14">
                          <span className="text-[10px] text-neutral-400 font-bold uppercase">Icon</span>
                          <input
                            type="text"
                            value={item.icon}
                            onChange={(e) => {
                              const next = [...trustItems];
                              next[idx].icon = e.target.value;
                              updateTrustItems(next);
                            }}
                            className="w-full px-2 py-1.5 border rounded-lg text-center text-sm font-bold"
                          />
                        </div>

                        <div className="flex-1">
                          <span className="text-[10px] text-neutral-400 font-bold uppercase">Badge Title</span>
                          <input
                            type="text"
                            value={item.label}
                            onChange={(e) => {
                              const next = [...trustItems];
                              next[idx].label = e.target.value;
                              updateTrustItems(next);
                            }}
                            className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-semibold"
                          />
                        </div>

                        <div className="flex-1">
                          <span className="text-[10px] text-neutral-400 font-bold uppercase">Subtitle / Description</span>
                          <input
                            type="text"
                            value={item.sub}
                            onChange={(e) => {
                              const next = [...trustItems];
                              next[idx].sub = e.target.value;
                              updateTrustItems(next);
                            }}
                            className="w-full px-2.5 py-1.5 border rounded-lg text-xs text-neutral-600"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleTrustItem(item.id)}
                            className={`px-2.5 py-1 text-xs font-bold rounded-lg border cursor-pointer ${
                              item.is_active
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-neutral-200 text-neutral-600 border-neutral-300"
                            }`}
                          >
                            {item.is_active ? "Active" : "Hidden"}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeTrustItem(item.id)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer text-sm"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-neutral-50 rounded-xl border border-dashed border-neutral-300 space-y-3">
                    <p className="text-xs font-bold text-neutral-700">+ Add New Trust Badge</p>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">Emoji / Icon</label>
                        <input
                          type="text"
                          value={newTrustIcon}
                          onChange={(e) => setNewTrustIcon(e.target.value)}
                          placeholder="🚀"
                          className="w-full px-3 py-2 border rounded-xl text-xs bg-white text-center text-base"
                        />
                      </div>
                      <div className="sm:col-span-5">
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">Badge Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Official Warranty"
                          value={newTrustLabel}
                          onChange={(e) => setNewTrustLabel(e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                        />
                      </div>
                      <div className="sm:col-span-5">
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">Subtitle</label>
                        <input
                          type="text"
                          placeholder="e.g. 6 Months Replacement"
                          value={newTrustSub}
                          onChange={(e) => setNewTrustSub(e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={addTrustItem}
                      className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Add to Trust Bar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════
                TAB 7: STORE INFORMATION
            ════════════════════════════════════════════════════════ */}
            {activeTab === "store" && (
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                <h3 className="font-bold text-neutral-900 border-b pb-3 text-xs uppercase tracking-wider text-red-600">Store Information</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Store Name</label>
                    <input
                      type="text"
                      value={settings.store_name || ""}
                      onChange={(e) => handleChange("store_name", e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">Support Email</label>
                      <input
                        type="email"
                        value={settings.store_email || ""}
                        onChange={(e) => handleChange("store_email", e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">Support Phone / WhatsApp</label>
                      <input
                        type="text"
                        value={settings.store_phone || ""}
                        onChange={(e) => handleChange("store_phone", e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Store Physical Address</label>
                    <input
                      type="text"
                      value={settings.store_address || ""}
                      onChange={(e) => handleChange("store_address", e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════
                TAB 8: SHIPPING & COD
            ════════════════════════════════════════════════════════ */}
            {activeTab === "shipping" && (
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                <h3 className="font-bold text-neutral-900 border-b pb-3 text-xs uppercase tracking-wider text-red-600">Shipping & Delivery Rates</h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Default Delivery Fee (PKR)</label>
                    <input
                      type="number"
                      value={settings.default_delivery_fee || ""}
                      onChange={(e) => handleChange("default_delivery_fee", Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Free Delivery Threshold (PKR)</label>
                    <input
                      type="number"
                      value={settings.free_shipping_threshold || ""}
                      onChange={(e) => handleChange("free_shipping_threshold", Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════
                TAB 9: PAYMENTS & CURRENCY
            ════════════════════════════════════════════════════════ */}
            {activeTab === "payments" && (
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                <h3 className="font-bold text-neutral-900 border-b pb-3 text-xs uppercase tracking-wider text-red-600">Payments & Currency</h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Currency Code</label>
                    <input
                      type="text"
                      value={settings.currency || "PKR"}
                      onChange={(e) => handleChange("currency", e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Currency Symbol</label>
                    <input
                      type="text"
                      value={settings.currency_symbol || "Rs. "}
                      onChange={(e) => handleChange("currency_symbol", e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-700">
                    <input
                      type="checkbox"
                      checked={Boolean(settings.cod_enabled)}
                      onChange={(e) => handleChange("cod_enabled", e.target.checked)}
                      className="h-4 w-4 rounded accent-black"
                    />
                    Enable Cash on Delivery (COD) Option at Checkout
                  </label>
                </div>
              </div>
            )}

            {/* Save Buttons Bar */}
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border shadow-sm">
              <p className="text-xs text-neutral-500">
                All changes to the header, reviews, brand story, flash deals, device models, trust badges, and settings are synchronized across the entire site.
              </p>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl cursor-pointer disabled:opacity-50 transition shadow-sm"
              >
                {saving ? "Saving..." : "Save All Configuration"}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
