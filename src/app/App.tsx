import { lazy, Suspense, useEffect } from "react";

import { useScrollReveal } from "../hooks/useScrollReveal";
import { usePathname } from "../hooks/usePathname";

import { ScrollProgress } from "../components/layout/ScrollProgress";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { WhatsAppFloat } from "../components/layout/WhatsAppFloat";

import { Hero } from "../sections/Hero";
import { TrustBar } from "../sections/TrustBar";
import { ModelSelector } from "../sections/ModelSelector";
import { CategoryGrid } from "../sections/CategoryGrid";
import { FeaturedProducts } from "../sections/FeaturedProducts";
import { BestSellers } from "../sections/BestSellers";
import { DealsOffers } from "../sections/DealsOffers";
import { AllProducts } from "../sections/AllProducts";
import { WhyChooseUs } from "../sections/WhyChooseUs";
import { BuyingGuide } from "../sections/BuyingGuide";
import { Comparison } from "../sections/Comparison";
import { BrandStory } from "../sections/BrandStory";
import { Reviews } from "../sections/Reviews";
import { SocialGallery } from "../sections/SocialGallery";
import { Blogs } from "../sections/Blogs";
import { Newsletter } from "../sections/Newsletter";
import { FinalCTA } from "../sections/FinalCTA";

/* ─────────────────────────────────────────────
   Store Pages
───────────────────────────────────────────── */

const ShopPage = lazy(() =>
  import("../pages/store/ShopPage").then((m) => ({
    default: m.ShopPage,
  })),
);

const ProductDetail = lazy(() =>
  import("../pages/store/ProductDetail").then((m) => ({
    default: m.ProductDetail,
  })),
);

const CartPage = lazy(() =>
  import("../pages/store/CartPage").then((m) => ({
    default: m.CartPage,
  })),
);

const CheckoutPage = lazy(() =>
  import("../pages/store/CheckoutPage").then((m) => ({
    default: m.CheckoutPage,
  })),
);

const OrderSuccessPage = lazy(() =>
  import("../pages/store/OrderSuccessPage").then((m) => ({
    default: m.OrderSuccessPage,
  })),
);

const WishlistPage = lazy(() =>
  import("../pages/store/WishlistPage").then((m) => ({
    default: m.WishlistPage,
  })),
);

const SearchPage = lazy(() =>
  import("../pages/store/SearchPage").then((m) => ({
    default: m.SearchPage,
  })),
);

const InfoPage = lazy(() =>
  import("../pages/store/InfoPage").then((m) => ({
    default: m.InfoPage,
  })),
);

const AccountPage = lazy(() =>
  import("../pages/store/AccountPage").then((m) => ({
    default: m.AccountPage,
  })),
);

const BlogPage = lazy(() =>
  import("../pages/store/BlogPage").then((m) => ({
    default: m.BlogPage,
  })),
);

const BlogDetailPage = lazy(() =>
  import("../pages/store/BlogDetailPage").then((m) => ({
    default: m.BlogDetailPage,
  })),
);

/* ─────────────────────────────────────────────
   Authentication Pages
───────────────────────────────────────────── */

const LoginPage = lazy(() =>
  import("../pages/store/Login").then((m) => ({
    default: m.LoginPage,
  })),
);

const RegisterPage = lazy(() =>
  import("../pages/store/Register").then((m) => ({
    default: m.RegisterPage,
  })),
);

/* ─────────────────────────────────────────────
   Admin Pages
───────────────────────────────────────────── */

const AdminDashboard = lazy(() =>
  import("../pages/admin/AdminDashboard").then((m) => ({
    default: m.AdminDashboard,
  })),
);

const AdminReports = lazy(() =>
  import("../pages/admin/AdminReports").then((m) => ({
    default: m.AdminReports,
  })),
);

const AdminOrders = lazy(() =>
  import("../pages/admin/AdminOrders").then((m) => ({
    default: m.AdminOrders,
  })),
);

const AdminProducts = lazy(() =>
  import("../pages/admin/AdminProducts").then((m) => ({
    default: m.AdminProducts,
  })),
);

const AdminCategories = lazy(() =>
  import("../pages/admin/AdminCategories").then((m) => ({
    default: m.AdminCategories,
  })),
);

const AdminBrands = lazy(() =>
  import("../pages/admin/AdminBrands").then((m) => ({
    default: m.AdminBrands,
  })),
);

const AdminAttributes = lazy(() =>
  import("../pages/admin/AdminAttributes").then((m) => ({
    default: m.AdminAttributes,
  })),
);

const AdminInventory = lazy(() =>
  import("../pages/admin/AdminInventory").then((m) => ({
    default: m.AdminInventory,
  })),
);

const AdminPayments = lazy(() =>
  import("../pages/admin/AdminPayments").then((m) => ({
    default: m.AdminPayments,
  })),
);

const AdminCustomers = lazy(() =>
  import("../pages/admin/AdminCustomers").then((m) => ({
    default: m.AdminCustomers,
  })),
);

const AdminCoupons = lazy(() =>
  import("../pages/admin/AdminCoupons").then((m) => ({
    default: m.AdminCoupons,
  })),
);

const AdminShipping = lazy(() =>
  import("../pages/admin/AdminShipping").then((m) => ({
    default: m.AdminShipping,
  })),
);

const AdminReviews = lazy(() =>
  import("../pages/admin/AdminReviews").then((m) => ({
    default: m.AdminReviews,
  })),
);

const AdminBlogs = lazy(() =>
  import("../pages/admin/AdminBlogs").then((m) => ({
    default: m.AdminBlogs,
  })),
);

const AdminUsers = lazy(() =>
  import("../pages/admin/AdminUsers").then((m) => ({
    default: m.AdminUsers,
  })),
);

const AdminRoles = lazy(() =>
  import("../pages/admin/AdminRoles").then((m) => ({
    default: m.AdminRoles,
  })),
);

const AdminSettings = lazy(() =>
  import("../pages/admin/AdminSettings").then((m) => ({
    default: m.AdminSettings,
  })),
);

/* ─────────────────────────────────────────────
   Home
───────────────────────────────────────────── */

function HomePage() {
  return (
    <main>
      <Hero />
      <TrustBar />
      <ModelSelector />
      <CategoryGrid />
      <FeaturedProducts />
      <BestSellers />
      <DealsOffers />
      <AllProducts />
      <WhyChooseUs />
      {/* <BuyingGuide /> */}
      {/* <Comparison /> */}
      <BrandStory />
      <Reviews />
      <SocialGallery />
      <Blogs />
      <Newsletter />
      <FinalCTA />
    </main>
  );
}

/* ─────────────────────────────────────────────
   Page Router
───────────────────────────────────────────── */

function PageContent({ pathname }: { pathname: string }) {
  /* Admin Routes */
  if (pathname === "/admin" || pathname === "/admin/dashboard") {
    return <AdminDashboard />;
  }

  if (pathname === "/admin/reports") {
    return <AdminReports />;
  }

  if (pathname === "/admin/orders") {
    return <AdminOrders />;
  }

  if (pathname === "/admin/products") {
    return <AdminProducts />;
  }

  if (pathname === "/admin/categories") {
    return <AdminCategories />;
  }

  if (pathname === "/admin/brands") {
    return <AdminBrands />;
  }

  if (pathname === "/admin/attributes") {
    return <AdminAttributes />;
  }

  if (pathname === "/admin/inventory") {
    return <AdminInventory />;
  }

  if (pathname === "/admin/payments") {
    return <AdminPayments />;
  }

  if (pathname === "/admin/customers") {
    return <AdminCustomers />;
  }

  if (pathname === "/admin/coupons") {
    return <AdminCoupons />;
  }

  if (pathname === "/admin/shipping") {
    return <AdminShipping />;
  }

  if (pathname === "/admin/reviews") {
    return <AdminReviews />;
  }

  if (pathname === "/admin/blogs") {
    return <AdminBlogs />;
  }

  if (pathname === "/admin/users") {
    return <AdminUsers />;
  }

  if (pathname === "/admin/roles") {
    return <AdminRoles />;
  }

  if (pathname === "/admin/settings") {
    return <AdminSettings />;
  }

  /* Storefront: Home */
  if (pathname === "/") {
    return <HomePage />;
  }

  /* Storefront: Shop */
  if (pathname === "/shop") {
    return <ShopPage />;
  }

  /* Storefront: Product Detail */
  if (pathname.startsWith("/product/")) {
    const rawId = pathname.split("/")[2];
    const id = Number(rawId);
    return <ProductDetail id={id} />;
  }

  /* Storefront: Cart */
  if (pathname === "/cart") {
    return <CartPage />;
  }

  /* Storefront: Checkout */
  if (pathname === "/checkout") {
    return <CheckoutPage />;
  }

  /* Storefront: Order Success */
  if (pathname === "/order-success") {
    return <OrderSuccessPage />;
  }

  /* Storefront: Wishlist */
  if (pathname === "/wishlist") {
    return <WishlistPage />;
  }

  /* Storefront: Account */
  if (pathname === "/account") {
    return <AccountPage />;
  }

  /* Storefront: Authentication */
  if (pathname === "/login") {
    return <LoginPage />;
  }

  if (pathname === "/register") {
    return <RegisterPage />;
  }

  /* Storefront: Search */
  if (pathname.startsWith("/search")) {
    const query = new URLSearchParams(window.location.search).get("q") ?? "";
    return <SearchPage initialQuery={query} />;
  }

  /* Storefront: Blog Article Detail */
  if (pathname.startsWith("/blog/")) {
    const slug = pathname.split("/")[2];
    return <BlogDetailPage slug={slug} />;
  }

  /* Storefront: Blog & Guides */
  if (pathname === "/blog" || pathname === "/blogs") {
    return <BlogPage />;
  }

  /* Storefront: Static Pages */
  if (pathname === "/buying-guide") {
    return (
      <main>
        <BuyingGuide />
        <ModelSelector />
        <FinalCTA />
      </main>
    );
  }

  if (pathname === "/compare") {
    return (
      <main>
        <Comparison />
        <FeaturedProducts />
        <FinalCTA />
      </main>
    );
  }

  if (pathname === "/reviews") {
    return (
      <main>
        <Reviews />
        <SocialGallery />
        <FinalCTA />
      </main>
    );
  }

  /* Info Pages */
  const info: Record<string, [string, string, string]> = {
    "/about": [
      "About Nothing Pakistan",
      "Our story",
      "A premium frontend storefront designed for the Nothing ecosystem in Pakistan.",
    ],
    "/contact": [
      "Contact us",
      "Get in touch",
      "Need help with a product, delivery or an order? Contact our support team.",
    ],
    "/faq": [
      "Frequently asked questions",
      "FAQ",
      "Find answers about products, ordering, delivery, payments, returns and warranty.",
    ],
    "/shipping-policy": [
      "Shipping policy",
      "Policies",
      "Delivery coverage, timelines and charges across Pakistan.",
    ],
    "/return-policy": [
      "Returns & refunds",
      "Policies",
      "Return and refund rules for purchased items.",
    ],
    "/warranty": [
      "Warranty",
      "Policies",
      "Official hardware warranty details.",
    ],
    "/privacy-policy": [
      "Privacy policy",
      "Legal",
      "Your privacy and customer data protection policy.",
    ],
    "/terms": [
      "Terms & conditions",
      "Legal",
      "Terms of service and store use.",
    ],
  };

  const entry = info[pathname];
  if (entry) {
    return <InfoPage title={entry[0]} eyebrow={entry[1]} text={entry[2]} />;
  }

  return <HomePage />;
}

/* ─────────────────────────────────────────────
   App
───────────────────────────────────────────── */

export default function App() {
  useScrollReveal();
  const pathname = usePathname();

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isAdminPage = pathname.startsWith("/admin");
  const isStorefront = !isAuthPage && !isAdminPage;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "auto",
    });

    const pageName =
      pathname === "/"
        ? "Nothing Pakistan"
        : pathname.startsWith("/admin")
        ? `Nothing Pakistan | Admin ${pathname.slice(7).replace(/-/g, " ")}`
        : `Nothing Pakistan | ${pathname.slice(1).split("/")[0].replace(/-/g, " ")}`;

    document.title = pageName;
  }, [pathname]);

  return (
    <div className="min-h-screen bg-white">
      {/* Storefront UI Header and Progress */}
      {isStorefront && <ScrollProgress />}
      {isStorefront && <Header />}

      <Suspense
        fallback={
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-red-600" />
          </div>
        }
      >
        <PageContent pathname={pathname} />
      </Suspense>

      {/* Storefront UI Footer and Floating actions */}
      {isStorefront && <Footer />}
      {isStorefront && <WhatsAppFloat />}
    </div>
  );
}