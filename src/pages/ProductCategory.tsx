import { useParams, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";
import { Pagination } from "@/components/common/Pagination";
import { useProductsByCategory, useCategory } from "@/hooks/useSanityData";
import { urlFor } from "@/sanity/client";
import { Skeleton } from "@/components/ui/skeleton";

const PRODUCTS_PER_PAGE = 8;

const ProductCategory = () => {
  const { category, page } = useParams<{ category: string; page?: string }>();
  const currentPage = page ? parseInt(page) : 1;

  const { data: categoryData, isLoading: categoryLoading } = useCategory(category);
  const { data: allProducts, isLoading: productsLoading } = useProductsByCategory(category);

  const isLoading = categoryLoading || productsLoading;

  // Show loading state
  if (isLoading) {
    return (
      <Layout>
        <section className="page-hero bg-secondary">
          <div className="absolute inset-0 bg-secondary/85" />
          <div className="page-hero-content">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
        </section>
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-card rounded-lg overflow-hidden">
                  <Skeleton className="aspect-square" />
                  <div className="p-4">
                    <Skeleton className="h-3 w-20 mb-2" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  // Redirect if category not found
  if (!categoryData) {
    return <Navigate to="/products" replace />;
  }

  const products = allProducts || [];
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const categoryImage = categoryData.image
    ? urlFor(categoryData.image).width(1920).url()
    : "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=1920&q=80";

  return (
    <Layout>
      <section 
        className="page-hero"
        style={{
          backgroundImage: `url(${categoryImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-secondary/85" />
        <div className="page-hero-content">
          <h1 className="page-hero-title">{categoryData.name} in Pune</h1>
          {categoryData.description && (
            <p className="text-secondary-foreground/80 mt-4 max-w-2xl">
              {categoryData.description}
            </p>
          )}
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                basePath={`/product-category/${category}`}
              />
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No products found in this category.</p>
              <p className="text-muted-foreground text-sm mt-2">Please check back later.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ProductCategory;
