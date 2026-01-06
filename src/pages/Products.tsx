import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/layout/PageHero";
import { ProductCard } from "@/components/products/ProductCard";
import { useProducts, useCategories } from "@/hooks/useSanityData";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const Products = () => {
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const isLoading = productsLoading || categoriesLoading;

  return (
    <Layout>
      <PageHero 
        title="Products" 
        backgroundImage="https://images.unsplash.com/photo-1563453392212-326f5e854473?w=1920&q=80"
      />
      
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Categories Quick Links */}
          {categoriesLoading ? (
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-32 rounded-full" />
              ))}
            </div>
          ) : categories && categories.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/product-category/${category.slug}`}
                  className="px-4 py-2 bg-muted rounded-full text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          ) : null}
          
          {/* Products Grid */}
          {productsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-card rounded-lg overflow-hidden">
                  <Skeleton className="aspect-square" />
                  <div className="p-4">
                    <Skeleton className="h-3 w-20 mb-2" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No products available at the moment.</p>
              <p className="text-muted-foreground text-sm mt-2">Please check back later.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Products;
