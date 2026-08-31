import React, { createContext, useContext, useEffect, useState } from "react";
import { cartApi, Cart } from "../api/cart";

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  cartCount: number;
  subtotal: number;
  addToCart: (productId: number, variantId?: number | null, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshCart = async () => {
    try {
      const data = await cartApi.getCart();
      setCart(data);
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();

    const handleCartUpdated = () => {
      refreshCart();
    };

    window.addEventListener("cart-updated", handleCartUpdated);
    return () => {
      window.removeEventListener("cart-updated", handleCartUpdated);
    };
  }, []);

  const addToCart = async (productId: number, variantId: number | null = null, quantity: number = 1) => {
    const updated = await cartApi.addItem({
      product_id: productId,
      product_variant_id: variantId,
      quantity,
    });
    setCart(updated);
    window.dispatchEvent(new CustomEvent("cart-updated"));
    window.dispatchEvent(new CustomEvent("open-cart-drawer"));
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    const updated = await cartApi.updateItem(itemId, quantity);
    setCart(updated);
    window.dispatchEvent(new CustomEvent("cart-updated"));
  };

  const removeItem = async (itemId: number) => {
    const updated = await cartApi.removeItem(itemId);
    setCart(updated);
    window.dispatchEvent(new CustomEvent("cart-updated"));
  };

  const clearCart = async () => {
    const updated = await cartApi.clearCart();
    setCart(updated);
    window.dispatchEvent(new CustomEvent("cart-updated"));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartCount: cart?.total_items ?? 0,
        subtotal: cart?.subtotal ?? 0,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
