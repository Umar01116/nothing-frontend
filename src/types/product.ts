import type { ReactNode } from "react";

export interface Product {
  id: number;
  name: string;
  model: string;
  price: number;
  oldPrice: number;
  discount: number;
  visual?: ReactNode;
  image?: string | null;
  tag?: string;
}
