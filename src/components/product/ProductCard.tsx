import { memo, useState } from "react";
import type { Product } from "../../types/product";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { navigateTo, resolveImageUrl } from "../../utils/store";

export function ProductCard({
  product,
}: {
  product: Product;
}) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [added, setAdded] = useState(false);
  const [togglingWishlist, setTogglingWishlist] = useState(false);

  const wished = isInWishlist(product.id);

  const handleAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await addToCart(product.id, undefined, 1);
      setAdded(true);
      setTimeout(() => {
        setAdded(false);
      }, 1500);
    } catch (error) {
      console.error("Unable to add product to cart:", error);
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setTogglingWishlist(true);
    try {
      await toggleWishlist(product);
    } catch (error) {
      console.error("Wishlist toggle error:", error);
    } finally {
      setTogglingWishlist(false);
    }
  };

  const handleClick = () => {
    navigateTo(`/product/${product.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="product-card group overflow-hidden rounded-2xl transition-all duration-400 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
      style={{
        background: "white",
        border: "1px solid #F0F0EE",
      }}
    >
      {/* Image area */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "#F7F7F5",
          height: "220px",
        }}
      >
        {/* Product Tag */}
        {product.tag && (
          <span
            className="absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-xs font-bold text-white shadow-sm"
            style={{
              background: "#E53528",
            }}
          >
            {product.tag}
          </span>
        )}

        {/* Discount */}
        {product.discount > 0 && (
          <span
            className="absolute right-12 top-3 z-10 rounded-full px-2 py-0.5 text-xs font-bold shadow-sm"
            style={{
              background: "#0A0A0A",
              color: "white",
            }}
          >
            -{product.discount}%
          </span>
        )}

        {/* Wishlist */}
        <button
          type="button"
          aria-pressed={wished}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          onClick={handleWishlistToggle}
          disabled={togglingWishlist}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 shadow-sm cursor-pointer"
          style={{
            background: wished ? "#E53528" : "white",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={wished ? "white" : "none"}
            stroke={wished ? "white" : "#0A0A0A"}
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Product Visual / Image */}
        <div className="product-image h-full w-full flex items-center justify-center overflow-hidden bg-neutral-100/50">
          {product.image ? (
            <img
              src={resolveImageUrl(product.image)}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="h-full w-full p-6 flex items-center justify-center">
              {product.visual}
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Model */}
        <div
          className="mb-1 text-xs uppercase tracking-wider font-medium"
          style={{
            color: "#6B6B6B",
            fontFamily: "Instrument Sans, sans-serif",
          }}
        >
          {product.model}
        </div>

        {/* Name */}
        <h3
          className="font-semibold text-sm leading-snug mb-3 line-clamp-2 transition-colors duration-200 group-hover:text-red-600"
          style={{
            color: "#0A0A0A",
            fontFamily: "Instrument Sans, sans-serif",
          }}
        >
          {product.name}
        </h3>

        {/* Price and Cart */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <div>
            <div
              className="font-bold text-base"
              style={{
                color: "#0A0A0A",
                fontFamily: "Instrument Sans, sans-serif",
              }}
            >
              ₨{product.price.toLocaleString()}
            </div>
            {product.oldPrice > product.price && (
              <div
                className="text-xs line-through"
                style={{ color: "#888888" }}
              >
                ₨{product.oldPrice.toLocaleString()}
              </div>
            )}
          </div>

          <button
            type="button"
            aria-label={`Add ${product.name} to cart`}
            onClick={handleAdd}
            className="flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
            style={{
              background: added ? "#16A34A" : "#0A0A0A",
              color: "white",
            }}
          >
            {added ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(ProductCard);