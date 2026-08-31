export const DELIVERY_FEE = 250;
export const FREE_DELIVERY_LIMIT = 10000;

export const money = (value: number) =>
  `₨${value.toLocaleString("en-PK")}`;

export const getDeliveryFee = (
  subtotal: number,
) =>
  subtotal >= FREE_DELIVERY_LIMIT
    ? 0
    : DELIVERY_FEE;

export function resolveImageUrl(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  const backendOrigin = import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/api\/v1\/?$/, "")
    : "http://127.0.0.1:8000";
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${backendOrigin}${cleanPath}`;
}

export function navigateTo(path: string) {
  if (
    window.location.pathname +
      window.location.search ===
    path
  ) {
    return;
  }

  window.history.pushState({}, "", path);

  window.dispatchEvent(
    new PopStateEvent("popstate"),
  );

  window.scrollTo({
    top: 0,
    behavior: "auto",
  });
}