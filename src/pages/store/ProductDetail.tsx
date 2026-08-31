import { useEffect, useState } from "react";
import { productsApi, Product, ProductVariant, Review } from "../../api/products";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { StorePageShell } from "../../components/store/StorePageShell";
import { QuantitySelector } from "../../components/store/QuantitySelector";
import { money, navigateTo, resolveImageUrl } from "../../utils/store";
import { CaseVisual, ChargerVisual, EarbudsVisual, CableVisual, PowerBankVisual } from "../../components/common/ProductVisuals";
import { RichTextRenderer } from "../../components/common/RichTextRenderer";

export function ProductDetail({ id }: { id: number }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "delivery" | "reviews">("description");

  // Review Form State
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function loadData() {
      try {
        const prod = await productsApi.getProduct(id);
        if (!isMounted) return;
        setProduct(prod);

        if (prod.variants && prod.variants.length > 0) {
          setSelectedVariant(prod.variants[0]);
        } else {
          setSelectedVariant(null);
        }

        // Fetch reviews and related products
        const [revRes, relRes] = await Promise.all([
          productsApi.getProductReviews(id).catch(() => ({ data: [] })),
          productsApi.getProducts({ category_id: prod.category_id, per_page: 4 }).catch(() => ({ data: [] })),
        ]);

        if (isMounted) {
          setReviews(revRes.data || []);
          setRelatedProducts((relRes.data || []).filter((p: Product) => p.id !== id));
        }
      } catch (err) {
        console.error("Failed to load product detail:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart(product.id, selectedVariant?.id, quantity);
      window.dispatchEvent(new Event("open-cart-drawer"));
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    try {
      await addToCart(product.id, selectedVariant?.id, quantity);
      navigateTo("/checkout");
    } catch (err) {
      console.error("Buy now error:", err);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigateTo("/login");
      return;
    }
    if (!product) return;

    setSubmittingReview(true);
    try {
      await productsApi.submitReview(product.id, {
        rating,
        title: reviewTitle,
        comment: reviewComment,
      });
      setReviewSuccess(true);
      setReviewTitle("");
      setReviewComment("");
      alert("Thank you! Your verified review has been submitted for moderation.");
    } catch (err: any) {
      alert(err.message || "Failed to submit review. (Note: Only verified buyers can submit reviews).");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <StorePageShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-200 border-t-red-600" />
        </div>
      </StorePageShell>
    );
  }

  if (!product) {
    return (
      <StorePageShell>
        <section className="mx-auto max-w-2xl rounded-3xl border border-[#E7E7E4] bg-[#F7F7F5] px-6 py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-xl font-bold shadow-sm text-red-600">
            !
          </div>
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-[#111] sm:text-3xl">
            Product Not Found
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#777]">
            The product you're looking for could not be found or may no longer be available.
          </p>
          <button
            type="button"
            onClick={() => navigateTo("/shop")}
            className="mt-7 h-12 rounded-xl bg-black px-7 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            Back to Shop
          </button>
        </section>
      </StorePageShell>
    );
  }

  const price = selectedVariant
    ? Number(selectedVariant.sale_price ?? selectedVariant.price)
    : Number(product.sale_price ?? product.price);
  const oldPrice = selectedVariant
    ? (selectedVariant.sale_price ? Number(selectedVariant.price) : 0)
    : (product.sale_price ? Number(product.price) : 0);
  const isOutOfStock = selectedVariant
    ? selectedVariant.stock_status === "out_of_stock"
    : product.stock_status === "out_of_stock";
  const activeSku = selectedVariant ? selectedVariant.sku : product.sku;

  // Visual fallback
  let visualElement = <CaseVisual color="#E53528" />;
  if (product.images?.[0]?.image) {
    visualElement = (
      <img src={resolveImageUrl(product.images[0].image)} alt={product.name} className="w-full h-full object-contain" />
    );
  }

  // Google Rich Snippet JSON-LD Product Schema
  let schemaData: any = null;
  if (product.schema_markup) {
    try {
      schemaData = JSON.parse(product.schema_markup);
    } catch {
      schemaData = product.schema_markup;
    }
  } else {
    schemaData = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "image": product.images?.map((i) => i.image) || [],
      "description": product.short_description || product.description || product.name,
      "sku": product.sku,
      "brand": {
        "@type": "Brand",
        "name": product.brand?.name || "Nothing",
      },
      "category": product.category?.name || "Accessories",
      "offers": {
        "@type": "Offer",
        "url": typeof window !== "undefined" ? window.location.href : "",
        "priceCurrency": "PKR",
        "price": String(price),
        "itemCondition": "https://schema.org/NewCondition",
        "availability": isOutOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "Nothing Accessories Pakistan",
        },
      },
      ...(reviews.length > 0
        ? {
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": (
                reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
              ).toFixed(1),
              "reviewCount": String(reviews.length),
            },
          }
        : {}),
    };
  }

  return (
    <StorePageShell>
      {/* Google SEO JSON-LD Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: typeof schemaData === "string" ? schemaData : JSON.stringify(schemaData),
        }}
      />

      {/* Breadcrumb */}
      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-[#999]">
        <button type="button" onClick={() => navigateTo("/shop")} className="transition hover:text-black">
          Shop
        </button>
        <span>/</span>
        <button
          type="button"
          onClick={() => navigateTo(`/shop?category=${encodeURIComponent(product.category?.name || "")}`)}
          className="transition hover:text-black"
        >
          {product.category?.name || "Accessories"}
        </button>
        <span>/</span>
        <span className="text-[#555]">{product.name}</span>
      </div>

      {/* Main Product Section */}
      <section className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        {/* Product Visual */}
        <div>
          <div className="relative flex min-h-[430px] items-center justify-center overflow-hidden rounded-[28px] bg-[#F7F7F5] p-8 sm:min-h-[550px] sm:p-12 border border-[#EBEBE8]">
            {product.is_new && (
              <span className="absolute left-5 top-5 rounded-full bg-red-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                New Launch
              </span>
            )}

            {oldPrice > price && (
              <span className="absolute right-5 top-5 rounded-full bg-black px-3 py-1.5 text-[10px] font-bold text-white shadow-sm">
                -{Math.round(((oldPrice - price) / oldPrice) * 100)}%
              </span>
            )}

            <div className="h-[350px] w-full max-w-lg sm:h-[450px] flex items-center justify-center">
              {visualElement}
            </div>
          </div>

          {/* Trust Features */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-[#E8E8E5] bg-white px-2 py-4 text-center">
              <div className="text-sm font-bold">✓</div>
              <p className="mt-1 text-[10px] font-semibold text-[#777] sm:text-xs">100% Genuine</p>
            </div>
            <div className="rounded-xl border border-[#E8E8E5] bg-white px-2 py-4 text-center">
              <div className="text-sm font-bold">↗</div>
              <p className="mt-1 text-[10px] font-semibold text-[#777] sm:text-xs">Fast Courier Delivery</p>
            </div>
            <div className="rounded-xl border border-[#E8E8E5] bg-white px-2 py-4 text-center">
              <div className="text-sm font-bold">◈</div>
              <p className="mt-1 text-[10px] font-semibold text-[#777] sm:text-xs">Cash on Delivery</p>
            </div>
          </div>
        </div>

        {/* Product Information */}
        <div className="flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
                isOutOfStock ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {isOutOfStock ? "Out of Stock" : "In Stock"}
            </span>

            {product.is_best_seller && (
              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-700">
                Bestseller
              </span>
            )}

            {product.category?.name && (
              <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-700">
                {product.category.name}
              </span>
            )}
          </div>

          <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-[#999] font-mono">
            SKU: {activeSku}
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#111] sm:text-4xl lg:text-5xl" style={{ fontFamily: "Instrument Sans, sans-serif" }}>
            {product.name}
          </h1>

          {/* Rating */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex gap-1 text-sm text-red-500 font-bold">★ ★ ★ ★ ★</div>
            <span className="text-xs text-[#777]">
              {reviews.length > 0 ? `${reviews.length} customer reviews` : "Authentic Product"}
            </span>
          </div>

          {/* Price */}
          <div className="mt-6 flex flex-wrap items-end gap-3">
            <span className="text-3xl font-bold text-red-600 sm:text-4xl">{money(price)}</span>

            {oldPrice > price && (
              <span className="pb-1 text-sm text-[#AAA] line-through">{money(oldPrice)}</span>
            )}
          </div>

          {oldPrice > price && (
            <p className="mt-2 text-xs font-semibold text-emerald-600">
              You save {money(oldPrice - price)} ({Math.round(((oldPrice - price) / oldPrice) * 100)}% OFF)
            </p>
          )}

          {/* Variant Selector Pills */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-6 p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                  Select Option / Variant
                </p>
                {selectedVariant && (
                  <span className="text-xs font-bold text-neutral-900">
                    {selectedVariant.attributes
                      ?.map((a) => a.value?.value)
                      .filter(Boolean)
                      .join(" • ") || selectedVariant.sku}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  const label = v.attributes
                    ?.map((a) => a.value?.value)
                    .filter(Boolean)
                    .join(" / ") || v.sku;

                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-2 ${
                        isSelected
                          ? "border-black bg-black text-white shadow-xs scale-102"
                          : "border-neutral-200 bg-white text-neutral-800 hover:border-black"
                      }`}
                    >
                      <span>{label}</span>
                      <span className={`text-[10px] font-bold ${isSelected ? "text-red-400" : "text-red-600"}`}>
                        {money(Number(v.sale_price ?? v.price))}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="my-6 h-px bg-[#E8E8E5]" />

          {/* Short Description */}
          <p className="text-sm leading-7 text-[#666] sm:text-base">
            {product.short_description || product.description || "Premium accessory designed specifically for the Nothing hardware ecosystem."}
          </p>

          {/* Add to Cart Actions */}
          <div className="mt-7">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#777]">Quantity</p>

            <div className="flex gap-3">
              <QuantitySelector value={quantity} onChange={setQuantity} />

              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className={`flex-1 rounded-xl text-sm font-semibold text-white transition disabled:opacity-40 cursor-pointer ${
                  added ? "bg-emerald-600" : "bg-black hover:bg-red-600"
                }`}
              >
                {isOutOfStock ? "Out of Stock" : added ? "Added to Cart ✓" : "Add to Cart"}
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                aria-label={product && isInWishlist(product.id) ? "Remove from Wishlist" : "Save to Wishlist"}
                onClick={() => product && toggleWishlist(product)}
                className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-all cursor-pointer shadow-xs ${
                  product && isInWishlist(product.id)
                    ? "border-red-600 bg-red-50 text-red-600 hover:bg-red-100"
                    : "border-neutral-200 bg-white text-neutral-800 hover:border-black"
                }`}
                title={product && isInWishlist(product.id) ? "Saved in Wishlist" : "Add to Wishlist"}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={product && isInWishlist(product.id) ? "#E53528" : "none"}
                  stroke={product && isInWishlist(product.id) ? "#E53528" : "currentColor"}
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>

            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleBuyNow}
              className="mt-3 h-12 w-full rounded-xl bg-red-600 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-40"
            >
              Buy Now (Express Checkout)
            </button>
          </div>

          {/* Information Tabs */}
          <div className="mt-8 border-y border-[#E8E8E5]">
            <div className="grid grid-cols-3 border-b border-[#E8E8E5]">
              {[
                ["description", "Overview"],
                ["delivery", "Shipping & COD"],
                ["reviews", `Reviews (${reviews.length})`],
              ].map(([tabId, label]) => (
                <button
                  key={tabId}
                  type="button"
                  onClick={() => setActiveTab(tabId as any)}
                  className={`relative py-4 text-xs font-semibold transition ${
                    activeTab === tabId ? "text-black" : "text-[#999] hover:text-black"
                  }`}
                >
                  {label}
                  {activeTab === tabId && <span className="absolute bottom-0 left-0 h-0.5 w-full bg-black" />}
                </button>
              ))}
            </div>

            <div className="py-5 text-sm leading-7 text-[#777]">
              {activeTab === "description" && (
                <div className="prose prose-neutral max-w-none text-sm leading-relaxed text-neutral-800 space-y-4">
                  <RichTextRenderer
                    content={
                      product.description ||
                      "Crafted specifically to complement the unique transparent aesthetic of Nothing devices."
                    }
                  />
                </div>
              )}

              {activeTab === "delivery" && (
                <p>
                  Delivered nationwide across Pakistan via standard couriers (Trax, CallCourier) within 2-4 business days. Same-day delivery available in major hubs.
                </p>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6">
                  {/* Reviews List */}
                  <div className="space-y-3">
                    {reviews.length > 0 ? (
                      reviews.map((rev) => (
                        <div key={rev.id} className="p-3 bg-[#F7F7F5] rounded-xl border border-neutral-200">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-neutral-900">{rev.user_name}</span>
                            <span className="text-red-500 font-bold text-xs">{"★".repeat(rev.rating)}</span>
                          </div>
                          {rev.title && <p className="font-semibold text-xs text-neutral-800 mt-1">{rev.title}</p>}
                          <p className="text-xs text-neutral-600 mt-0.5">{rev.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-neutral-400">No verified reviews yet. Be the first to review!</p>
                    )}
                  </div>

                  {/* Submit Review Form */}
                  <form onSubmit={handleSubmitReview} className="pt-4 border-t space-y-3">
                    <h4 className="font-bold text-xs text-neutral-900 uppercase tracking-wider">Leave a Review</h4>
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-semibold">Rating:</label>
                      <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="px-2 py-1 border rounded text-xs"
                      >
                        <option value={5}>5 Stars (Excellent)</option>
                        <option value={4}>4 Stars (Good)</option>
                        <option value={3}>3 Stars (Average)</option>
                        <option value={2}>2 Stars (Poor)</option>
                        <option value={1}>1 Star (Terrible)</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      placeholder="Headline (e.g. Perfect fit!)"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      className="w-full px-3 py-1.5 border rounded-lg text-xs"
                    />
                    <textarea
                      rows={2}
                      required
                      placeholder="Share your thoughts about this product..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full px-3 py-1.5 border rounded-lg text-xs"
                    />
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-lg disabled:opacity-50"
                    >
                      {submittingReview ? "Submitting..." : "Submit Verified Review"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t border-[#E8E8E5] pt-12 sm:mt-20 sm:pt-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-600">You may also like</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#111] sm:text-3xl">Related Products</h2>
            </div>
            <button
              type="button"
              onClick={() => navigateTo("/shop")}
              className="hidden text-sm font-semibold text-[#111] underline decoration-[#CCC] underline-offset-4 hover:decoration-black sm:block"
            >
              View all
            </button>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((item) => (
              <div
                key={item.id}
                onClick={() => navigateTo(`/product/${item.id}`)}
                className="group overflow-hidden rounded-2xl border border-[#E8E8E5] bg-white text-left transition hover:-translate-y-1 hover:border-[#D5D5D2] hover:shadow-lg cursor-pointer"
              >
                <div className="h-40 sm:h-48 overflow-hidden bg-neutral-100/60 flex items-center justify-center relative">
                  {item.images?.[0]?.image ? (
                    <img
                      src={resolveImageUrl(item.images[0].image)}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="text-2xl">📦</div>
                  )}
                </div>
                <div className="p-4">
                  <p className="truncate text-[10px] font-bold uppercase tracking-wider text-[#999]">
                    {item.category?.name || "Accessory"}
                  </p>
                  <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold leading-5 text-[#111]">{item.name}</h3>
                  <p className="mt-3 text-sm font-bold text-red-600">
                    {money(Number(item.sale_price ?? item.price))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </StorePageShell>
  );
}

export default ProductDetail;