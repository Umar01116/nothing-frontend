import type { Product } from "../types/product";
import { CaseVisual, ChargerVisual, EarbudsVisual, CableVisual, PowerBankVisual } from "../components/common/ProductVisuals";

export const products: Product[] = [
  { id: 1, name: "Nothing Phone (2) Crystal Clear Case", model: "Nothing Phone (2)", price: 2499, oldPrice: 3499, discount: 28, tag: "New", visual: <CaseVisual color="#E53528" accent="#0A0A0A" /> },
  { id: 2, name: "CMF Buds Pro 2 Wireless Earphones", model: "CMF by Nothing", price: 8999, oldPrice: 12999, discount: 30, tag: "Bestseller", visual: <EarbudsVisual color="#E53528" /> },
  { id: 3, name: "65W GaN Ultra Fast Charger", model: "Universal", price: 3999, oldPrice: 5499, discount: 27, visual: <ChargerVisual color="#0A0A0A" /> },
  { id: 4, name: "Nothing Phone (2a) Bumper Case", model: "Nothing Phone (2a)", price: 1999, oldPrice: 2999, discount: 33, visual: <CaseVisual color="#3A3A3A" accent="#E53528" /> },
  { id: 5, name: "240W Braided USB-C Cable — 2M", model: "Universal", price: 1499, oldPrice: 1999, discount: 25, visual: <CableVisual color="#E53528" /> },
  { id: 6, name: "CMF PowerBank 10000 — 45W PD", model: "CMF by Nothing", price: 5999, oldPrice: 7999, discount: 25, tag: "Hot Deal", visual: <PowerBankVisual color="#E53528" /> },
  { id: 7, name: "Nothing Phone (2a) Clear Case", model: "Nothing Phone (2a)", price: 2199, oldPrice: 2999, discount: 27, visual: <CaseVisual color="#0A0A0A" accent="#E53528" /> },
  { id: 8, name: "100W GaN Desktop Charger", model: "Universal", price: 6499, oldPrice: 7999, discount: 19, tag: "New", visual: <ChargerVisual color="#E53528" /> },
  { id: 9, name: "CMF Buds Wireless Earphones", model: "CMF by Nothing", price: 6999, oldPrice: 8999, discount: 22, visual: <EarbudsVisual color="#0A0A0A" /> },
  { id: 10, name: "Braided USB-C Cable — 1M", model: "Universal", price: 999, oldPrice: 1299, discount: 23, visual: <CableVisual color="#0A0A0A" /> },
  { id: 11, name: "CMF PowerBank 20000 — 45W PD", model: "CMF by Nothing", price: 7999, oldPrice: 9999, discount: 20, visual: <PowerBankVisual color="#0A0A0A" /> },
  { id: 12, name: "Nothing Phone (1) Protective Case", model: "Nothing Phone (1)", price: 1799, oldPrice: 2499, discount: 28, visual: <CaseVisual color="#E53528" accent="#3A3A3A" /> },
];

export const findProduct = (id: number) => products.find((product) => product.id === id) ?? products[0];
