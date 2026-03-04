import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import ProductCategory from "./pages/ProductCategory";
import Categories from "./pages/Categories";
import Category from "./pages/Category";
import Client from "./pages/Client";
import ContactUs from "./pages/ContactUs";
import NotFound from "./pages/NotFound";

const StudioPage = lazy(() => import("./studio/Studio"));
const InternalInvoice = lazy(() => import("./pages/InternalInvoice"));

const queryClient = new QueryClient();

// Get basename for GitHub Pages subdirectory deployment
const basename = import.meta.env.BASE_URL;

const ConditionalWhatsApp = () => {
  const location = useLocation();
  if (location.pathname.startsWith("/studio") || location.pathname.startsWith("/internal-invoice")) return null;
  return <WhatsAppButton phoneNumber="919421209422" message="Hello! I'm interested in your products." />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={basename}>
        <ScrollToTop />
        <ConditionalWhatsApp />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/product-category" element={<Categories />} />
          <Route path="/product-category/:category" element={<ProductCategory />} />
          <Route path="/product-category/:category/page/:page" element={<ProductCategory />} />
          <Route path="/category/:category" element={<Category />} />
          <Route path="/category/:category/page/:page" element={<Category />} />
          <Route path="/client" element={<Client />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route
            path="/studio/*"
            element={
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading Studio...</div>}>
                <StudioPage />
              </Suspense>
            }
          />
          <Route
            path="/internal-invoice"
            element={
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading Invoices...</div>}>
                <InternalInvoice />
              </Suspense>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
