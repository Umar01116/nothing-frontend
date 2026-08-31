import { useEffect, useState } from "react";
import logoImage from "../../imports/image.png";
import CartDrawer from "../store/CartDrawer";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { settingsApi, StoreSettings, HeaderMenuItem } from "../../api/settings";

const DEFAULT_NAV_LINKS: HeaderMenuItem[] = [
  { id: "1", label: "Shop", path: "/shop", is_active: true },
  { id: "2", label: "Buying Guide", path: "/buying-guide", is_active: true },
  { id: "3", label: "Compare", path: "/compare", is_active: true },
  { id: "4", label: "Reviews", path: "/reviews", is_active: true },
  { id: "5", label: "Blog", path: "/blog", is_active: true },
];

function navigateTo(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "auto" });
}

export function Header() {
  const { itemsCount } = useCart();
  const { user } = useAuth();
  const { wishlistCount } = useWishlist();

  const [settings, setSettings] = useState<StoreSettings | null>(() => settingsApi.getCachedSettings());
  const [scrolled, setScrolled] = useState(() => window.scrollY > 40);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  /* ─────────────────────────────────────────
     Load Dynamic Settings
  ───────────────────────────────────────── */
  useEffect(() => {
    let isMounted = true;
    settingsApi
      .getSettings()
      .then((data) => {
        if (isMounted && data) {
          setSettings(data);
        }
      })
      .catch((err) => console.error("Failed to load header settings:", err));

    const handleSettingsUpdate = (e: any) => {
      if (isMounted && e.detail) {
        setSettings(e.detail);
      }
    };

    window.addEventListener("settings-updated", handleSettingsUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener("settings-updated", handleSettingsUpdate);
    };
  }, []);

  /* ─────────────────────────────────────────
     Scroll
  ───────────────────────────────────────── */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ─────────────────────────────────────────
     Cart Drawer Trigger Listener
  ───────────────────────────────────────── */
  useEffect(() => {
    const handleOpenCart = () => {
      setCartOpen(true);
    };

    window.addEventListener("open-cart-drawer", handleOpenCart);
    return () => window.removeEventListener("open-cart-drawer", handleOpenCart);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      navigateTo(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  // Resolved dynamic values with rock-solid fallbacks
  const siteLogo = settings?.site_logo || logoImage;
  const siteLogoAlt = settings?.site_logo_alt || "Nothing Accessories Pakistan";
  const rawMenu = settings?.header_menu;
  const activeMenuItems: HeaderMenuItem[] = Array.isArray(rawMenu) && rawMenu.length > 0
    ? rawMenu.filter((m) => m.is_active !== false)
    : DEFAULT_NAV_LINKS;

  const actions = settings?.header_actions || {
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

  const showSearch = actions.show_search !== false;
  const showWishlist = actions.show_wishlist !== false;
  const showAccount = actions.show_account !== false;
  const showCart = actions.show_cart !== false;
  const ctaBtn = actions.cta_button || { show: true, text: "Shop Now", link: "/shop" };

  const announcement = settings?.announcement_bar;

  return (
    <>
      {/* ═══════════════════════════════════════
          DYNAMIC TOP ANNOUNCEMENT BANNER
      ═══════════════════════════════════════ */}
      {announcement?.show && announcement.text && (
        <div
          className="fixed top-0 left-0 right-0 z-50 py-2 px-4 text-center text-xs font-semibold tracking-wide transition-all shadow-xs"
          style={{
            backgroundColor: announcement.bg_color || "#0A0A0A",
            color: announcement.text_color || "#FFFFFF",
          }}
        >
          {announcement.link ? (
            <a
              href={announcement.link}
              onClick={(e) => {
                if (announcement.link.startsWith("/")) {
                  e.preventDefault();
                  navigateTo(announcement.link);
                }
              }}
              className="hover:underline flex items-center justify-center gap-1.5"
            >
              <span>{announcement.text}</span>
              <span>→</span>
            </a>
          ) : (
            <span>{announcement.text}</span>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════
          MAIN HEADER
      ═══════════════════════════════════════ */}
      <header
        className="fixed left-0 right-0 z-40 transition-all duration-500"
        style={{
          top: announcement?.show && announcement.text ? "32px" : "0px",
          background: scrolled ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: scrolled ? "1px solid #E2E2E0" : "1px solid transparent",
          boxShadow: scrolled ? "0 2px 40px rgba(0,0,0,0.06)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between" style={{ height: "72px" }}>
            
            {/* DYNAMIC LOGO */}
            <button
              type="button"
              onClick={() => navigateTo("/")}
              className="flex items-center gap-2 flex-shrink-0 cursor-pointer"
              aria-label="Go to home"
            >
              <img
                src={siteLogo}
                alt={siteLogoAlt}
                className="h-9 sm:h-10 max-w-[170px] object-contain transition-transform hover:opacity-90"
                decoding="async"
              />
            </button>

            {/* DYNAMIC DESKTOP NAVIGATION */}
            <nav className="hidden lg:flex items-center gap-7 xl:gap-8">
              {activeMenuItems.map((item) => (
                <button
                  key={item.id || item.path}
                  type="button"
                  onClick={() => {
                    if (item.is_external || item.path.startsWith("http")) {
                      window.open(item.path, "_blank");
                    } else {
                      navigateTo(item.path);
                    }
                  }}
                  className="underline-hover text-sm font-medium tracking-wide transition-colors duration-200 cursor-pointer"
                  style={{
                    color: "#3A3A3A",
                    fontFamily: "Instrument Sans, sans-serif",
                  }}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* DYNAMIC HEADER ACTIONS & BUTTONS */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* SEARCH BUTTON */}
              {showSearch && (
                <button
                  type="button"
                  onClick={() => setSearchOpen((open) => !open)}
                  className="p-2 rounded-full transition-colors duration-200 hover:bg-gray-100 cursor-pointer"
                  aria-label="Search"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#0A0A0A"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </button>
              )}

              {/* WISHLIST BUTTON */}
              {showWishlist && (
                <button
                  type="button"
                  onClick={() => navigateTo("/wishlist")}
                  className="relative p-2 rounded-full transition-colors duration-200 hover:bg-gray-100 hidden sm:flex cursor-pointer"
                  aria-label="Wishlist"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#0A0A0A"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white shadow-xs">
                      {wishlistCount > 9 ? "9+" : wishlistCount}
                    </span>
                  )}
                </button>
              )}

              {/* ACCOUNT BUTTON */}
              {showAccount && (
                <button
                  type="button"
                  onClick={() => navigateTo(user ? "/account" : "/login")}
                  className="p-2 rounded-full transition-colors duration-200 hover:bg-gray-100 hidden sm:flex cursor-pointer"
                  aria-label="Account"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={user ? "#E53528" : "#0A0A0A"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                  </svg>
                </button>
              )}

              {/* CART DRAWER BUTTON */}
              {showCart && (
                <button
                  type="button"
                  onClick={() => setCartOpen(true)}
                  className="relative p-2 rounded-full transition-colors duration-200 hover:bg-gray-100 cursor-pointer"
                  aria-label="Cart"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#0A0A0A"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>

                  {itemsCount > 0 && (
                    <span
                      className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-semibold"
                      style={{
                        background: "#E53528",
                        fontSize: "10px",
                      }}
                    >
                      {itemsCount}
                    </span>
                  )}
                </button>
              )}

              {/* CUSTOM HEADER CTA BUTTON */}
              {ctaBtn.show && ctaBtn.text && (
                <button
                  type="button"
                  onClick={() => {
                    if (ctaBtn.link?.startsWith("http")) {
                      window.open(ctaBtn.link, "_blank");
                    } else {
                      navigateTo(ctaBtn.link || "/shop");
                    }
                  }}
                  className="hidden lg:flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold tracking-wide transition-all duration-300 hover:opacity-90 hover:scale-[0.98] cursor-pointer shadow-xs"
                  style={{
                    background: "#0A0A0A",
                    borderRadius: "8px",
                    fontFamily: "Instrument Sans, sans-serif",
                  }}
                >
                  {ctaBtn.text}
                </button>
              )}

              {/* MOBILE MENU TOGGLE */}
              <button
                type="button"
                className="lg:hidden p-2 cursor-pointer"
                onClick={() => setMobileOpen((open) => !open)}
                aria-label="Menu"
                aria-expanded={mobileOpen}
              >
                <div className="flex flex-col gap-1.5 w-5">
                  <span
                    className="block h-0.5 transition-all duration-300"
                    style={{
                      background: "#0A0A0A",
                      transformOrigin: "center",
                      transform: mobileOpen ? "rotate(45deg) translateY(8px)" : "none",
                    }}
                  />
                  <span
                    className="block h-0.5 transition-all duration-300"
                    style={{
                      background: "#0A0A0A",
                      opacity: mobileOpen ? 0 : 1,
                    }}
                  />
                  <span
                    className="block h-0.5 transition-all duration-300"
                    style={{
                      background: "#0A0A0A",
                      transformOrigin: "center",
                      transform: mobileOpen ? "rotate(-45deg) translateY(-8px)" : "none",
                    }}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* ═══════════════════════════════════
              QUICK SEARCH BAR OVERLAY
          ═══════════════════════════════════ */}
          <div
            className="overflow-hidden transition-all duration-300"
            style={{
              maxHeight: searchOpen ? "64px" : "0",
              opacity: searchOpen ? 1 : 0,
            }}
          >
            <form onSubmit={handleSearchSubmit} className="py-2 pb-3">
              <div className="relative">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Nothing Phone cases, GaN chargers, CMF audio..."
                  autoFocus={searchOpen}
                  className="w-full pl-4 pr-10 py-2 text-sm rounded-xl border border-neutral-300 bg-white/90 focus:outline-none focus:border-black shadow-inner"
                  style={{ fontFamily: "Instrument Sans, sans-serif" }}
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-black cursor-pointer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* ═══════════════════════════════════
              MOBILE NAVIGATION DRAWER
          ═══════════════════════════════════ */}
          <div
            className="lg:hidden overflow-hidden transition-all duration-400"
            style={{
              maxHeight: mobileOpen ? "500px" : "0",
              opacity: mobileOpen ? 1 : 0,
            }}
          >
            <nav className="flex flex-col py-4 gap-1 border-t border-neutral-200">
              {activeMenuItems.map((item) => (
                <button
                  key={item.id || item.path}
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    if (item.is_external || item.path.startsWith("http")) {
                      window.open(item.path, "_blank");
                    } else {
                      navigateTo(item.path);
                    }
                  }}
                  className="w-full text-left px-2 py-3 text-sm font-medium border-b border-neutral-100 transition-colors hover:text-red-600"
                  style={{
                    color: "#0A0A0A",
                    fontFamily: "Instrument Sans, sans-serif",
                  }}
                >
                  {item.label}
                </button>
              ))}

              {/* MOBILE WISHLIST */}
              {showWishlist && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    navigateTo("/wishlist");
                  }}
                  className="w-full text-left px-2 py-3 text-sm font-medium border-b border-neutral-100 transition-colors hover:text-red-600 flex items-center justify-between"
                  style={{
                    color: "#0A0A0A",
                    fontFamily: "Instrument Sans, sans-serif",
                  }}
                >
                  <span>My Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-red-600 text-[10px] font-bold text-white">
                      {wishlistCount}
                    </span>
                  )}
                </button>
              )}

              {/* MOBILE ACCOUNT */}
              {showAccount && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    navigateTo(user ? "/account" : "/login");
                  }}
                  className="w-full text-left px-2 py-3 text-sm font-medium border-b border-neutral-100 transition-colors hover:text-red-600"
                  style={{
                    color: "#0A0A0A",
                    fontFamily: "Instrument Sans, sans-serif",
                  }}
                >
                  {user ? "My Account" : "Sign In / Register"}
                </button>
              )}

              {/* MOBILE CTA */}
              {ctaBtn.show && ctaBtn.text && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    navigateTo(ctaBtn.link || "/shop");
                  }}
                  className="mt-3 px-4 py-3 text-center text-white font-semibold shadow-sm cursor-pointer"
                  style={{
                    background: "#E53528",
                    borderRadius: "8px",
                  }}
                >
                  {ctaBtn.text}
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════
          CART DRAWER
      ═══════════════════════════════════════ */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

export default Header;