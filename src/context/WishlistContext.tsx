import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { wishlistApi, WishlistItem, Wishlist } from "../api/wishlist";
import { useAuth } from "./AuthContext";
import { productsApi, Product } from "../api/products";

interface WishlistContextType {
  wishlist: Wishlist | null;
  wishlistItems: WishlistItem[];
  wishlistIds: Set<number>;
  wishlistCount: number;
  loading: boolean;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (product: { id: number; [key: string]: any }) => Promise<boolean>;
  removeFromWishlist: (productId: number) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const GUEST_WISHLIST_KEY = "nothing_guest_wishlist_items";

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  // Load guest items from localStorage
  const loadGuestWishlist = (): WishlistItem[] => {
    try {
      const stored = localStorage.getItem(GUEST_WISHLIST_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return [];
  };

  const saveGuestWishlist = (items: WishlistItem[]) => {
    try {
      localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  };

  const refreshWishlist = useCallback(async () => {
    setLoading(true);
    if (user) {
      try {
        const data = await wishlistApi.getWishlist();
        if (data) {
          setWishlist(data);
          const items = data.items || [];
          setWishlistItems(items);
          const ids = new Set<number>(items.map((i) => i.product?.id || (i as any).product_id));
          setWishlistIds(ids);

          // If there were any guest items prior to login, sync them
          const guestItems = loadGuestWishlist();
          if (guestItems.length > 0) {
            for (const g of guestItems) {
              const pid = g.product?.id || g.id;
              if (pid && !ids.has(pid)) {
                await wishlistApi.toggleWishlist(pid).catch(() => {});
                ids.add(pid);
              }
            }
            localStorage.removeItem(GUEST_WISHLIST_KEY);
            const updated = await wishlistApi.getWishlist();
            if (updated) {
              setWishlist(updated);
              setWishlistItems(updated.items || []);
              setWishlistIds(new Set((updated.items || []).map((i) => i.product?.id || (i as any).product_id)));
            }
          }
        }
      } catch (err) {
        console.error("Failed to load user wishlist:", err);
      } finally {
        setLoading(false);
      }
    } else {
      // Guest mode
      const guestItems = loadGuestWishlist();
      setWishlistItems(guestItems);
      setWishlistIds(new Set(guestItems.map((i) => i.product?.id || i.id)));
      setWishlist(null);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshWishlist();

    const handleWishlistUpdated = () => {
      refreshWishlist();
    };

    window.addEventListener("wishlist-updated", handleWishlistUpdated);
    return () => {
      window.removeEventListener("wishlist-updated", handleWishlistUpdated);
    };
  }, [refreshWishlist]);

  const isInWishlist = useCallback(
    (productId: number): boolean => {
      return wishlistIds.has(Number(productId));
    },
    [wishlistIds]
  );

  const toggleWishlist = async (product: { id: number; [key: string]: any }): Promise<boolean> => {
    const pid = Number(product.id);
    const currentlyWished = wishlistIds.has(pid);
    const nextState = !currentlyWished;

    // Optimistically update IDs
    const nextIds = new Set(wishlistIds);
    if (nextState) {
      nextIds.add(pid);
    } else {
      nextIds.delete(pid);
    }
    setWishlistIds(nextIds);

    if (user) {
      try {
        const res = await wishlistApi.toggleWishlist(pid);
        const isWishlisted = res.is_wishlisted ?? nextState;
        if (res.wishlist) {
          setWishlist(res.wishlist);
          setWishlistItems(res.wishlist.items || []);
          setWishlistIds(new Set((res.wishlist.items || []).map((i) => i.product?.id || (i as any).product_id)));
        }
        window.dispatchEvent(new CustomEvent("wishlist-updated"));
        return isWishlisted;
      } catch (err) {
        console.error("Wishlist toggle API error:", err);
        // revert
        setWishlistIds(wishlistIds);
        return currentlyWished;
      }
    } else {
      // Guest local storage update
      let guestItems = loadGuestWishlist();
      if (nextState) {
        // Add
        const newItem: WishlistItem = {
          id: pid,
          product: (product.product || product) as Product,
          added_at: new Date().toISOString(),
        };
        guestItems = [newItem, ...guestItems.filter((i) => (i.product?.id || i.id) !== pid)];
      } else {
        // Remove
        guestItems = guestItems.filter((i) => (i.product?.id || i.id) !== pid);
      }
      saveGuestWishlist(guestItems);
      setWishlistItems(guestItems);
      window.dispatchEvent(new CustomEvent("wishlist-updated"));
      return nextState;
    }
  };

  const removeFromWishlist = async (productId: number): Promise<void> => {
    const pid = Number(productId);
    const nextIds = new Set(wishlistIds);
    nextIds.delete(pid);
    setWishlistIds(nextIds);

    if (user) {
      try {
        const res = await wishlistApi.removeFromWishlist(pid);
        if (res) {
          setWishlist(res);
          setWishlistItems(res.items || []);
          setWishlistIds(new Set((res.items || []).map((i) => i.product?.id || (i as any).product_id)));
        }
        window.dispatchEvent(new CustomEvent("wishlist-updated"));
      } catch (err) {
        console.error("Failed to remove item from wishlist:", err);
      }
    } else {
      let guestItems = loadGuestWishlist();
      guestItems = guestItems.filter((i) => (i.product?.id || i.id) !== pid);
      saveGuestWishlist(guestItems);
      setWishlistItems(guestItems);
      window.dispatchEvent(new CustomEvent("wishlist-updated"));
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistItems,
        wishlistIds,
        wishlistCount: wishlistIds.size,
        loading,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
