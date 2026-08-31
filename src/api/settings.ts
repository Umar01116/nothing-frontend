import { apiClient } from "./client";

export interface HeaderMenuItem {
  id: string;
  label: string;
  path: string;
  is_active: boolean;
  is_external?: boolean;
}

export interface HeaderActionsSettings {
  show_search: boolean;
  show_wishlist: boolean;
  show_account: boolean;
  show_cart: boolean;
  cta_button: {
    show: boolean;
    text: string;
    link: string;
  };
}

export interface AnnouncementBarSettings {
  show: boolean;
  text: string;
  link: string;
  bg_color: string;
  text_color: string;
}

export interface TrustBadgeItem {
  id: string;
  icon: string;
  label: string;
  sub: string;
  is_active: boolean;
}

export interface TrustBarSettings {
  show: boolean;
  bg_color: string;
  text_color: string;
  sub_text_color?: string;
  border_color?: string;
  items: TrustBadgeItem[];
}

export interface DeviceModelItem {
  id: string;
  name: string;
  year: string;
  brand?: string;
  color: string;
  is_active: boolean;
}

export interface DeviceModelsSettings {
  show: boolean;
  title?: string;
  subtitle?: string;
  badge?: string;
  items: DeviceModelItem[];
}

export interface FlashSaleSettings {
  show: boolean;
  badge?: string;
  title?: string;
  highlight?: string;
  description?: string;
  countdown_hours?: number;
  cta_text?: string;
  cta_link?: string;
  bg_color?: string;
  product_ids?: number[];
}

export interface BrandStoryStat {
  id: string;
  num: string;
  label: string;
}

export interface BrandStoryCard {
  id: string;
  label: string;
  type?: string;
  image?: string;
  link?: string;
}

export interface BrandStorySettings {
  show: boolean;
  heading_line1?: string;
  heading_highlight?: string;
  heading_line2?: string;
  description?: string;
  stats?: BrandStoryStat[];
  cards?: BrandStoryCard[];
  bg_color?: string;
  accent_color?: string;
}

export interface ReviewItem {
  id: string;
  name: string;
  city: string;
  rating: number;
  text: string;
  product: string;
  avatar?: string;
  is_verified?: boolean;
  is_active: boolean;
}

export interface ReviewsSectionSettings {
  show: boolean;
  badge?: string;
  title?: string;
  rating_score?: string;
  rating_text?: string;
  items: ReviewItem[];
}

export interface StoreSettings {
  store_name?: string;
  store_email?: string;
  store_phone?: string;
  store_address?: string;
  currency?: string;
  currency_symbol?: string;
  free_shipping_threshold?: number;
  default_delivery_fee?: number;
  cod_enabled?: boolean;
  tax_percentage?: number;

  // Header & Navigation Dynamic Settings
  site_logo?: string;
  site_logo_alt?: string;
  header_menu?: HeaderMenuItem[];
  header_actions?: HeaderActionsSettings;
  announcement_bar?: AnnouncementBarSettings;

  // Trust Bar & Marquee Settings
  trust_bar_settings?: TrustBarSettings;

  // Device Lineup Models Settings
  device_models_settings?: DeviceModelsSettings;

  // Flash Deals / Limited Time Sale Settings
  flash_sale_settings?: FlashSaleSettings;

  // Brand Story ("Built for Nothing") Settings
  brand_story_settings?: BrandStorySettings;

  // Customer Reviews & Testimonials Settings
  reviews_section_settings?: ReviewsSectionSettings;

  [key: string]: any;
}

const SETTINGS_CACHE_KEY = "nothing_store_settings_cache";

export const settingsApi = {
  getCachedSettings(): StoreSettings | null {
    try {
      const cached = localStorage.getItem(SETTINGS_CACHE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {
      // ignore
    }
    return null;
  },

  async getSettings() {
    try {
      const res = await apiClient<StoreSettings>("/settings");
      if (res.data) {
        try {
          localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(res.data));
        } catch {
          // ignore
        }
      }
      return res.data;
    } catch (err) {
      // Fallback to cache if network fails
      const cached = this.getCachedSettings();
      if (cached) {
        return cached;
      }
      throw err;
    }
  },

  saveSettingsCache(data: StoreSettings) {
    try {
      localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent("settings-updated", { detail: data }));
    } catch {
      // ignore
    }
  },
};
