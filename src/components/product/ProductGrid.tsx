import { memo } from "react";
import type { Product } from "../../types/product";
import ProductCard from "./ProductCard";

type ProductGridProps = {
  products: Product[];
  className?: string;
};

function ProductGrid({
  products,
  className = "",
}: ProductGridProps) {
  if (!products.length) {
    return null;
  }

  return (
    <div
      className={`grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 sm:gap-4 xl:gap-5 ${className}`}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}

export default memo(ProductGrid);