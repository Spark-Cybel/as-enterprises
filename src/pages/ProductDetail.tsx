import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useProduct, useRelatedProducts } from "@/hooks/useSanityData";
import { urlFor } from "@/sanity/client";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const { data: product, isLoading: productLoading } = useProduct(slug);
  const { data: relatedProducts, isLoading: relatedLoading } = useRelatedProducts(
    product?.categorySlug,
    product?.slug
  );

  // Show loading state
  if (productLoading) {
    return (
      <Layout>
        <div className="bg-muted py-4">
          <div className="container mx-auto px-4">
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              <Skeleton className="aspect-square rounded-lg" />
              <div>
                <Skeleton className="h-10 w-3/4 mb-4" />
                <div className="space-y-2 mb-6">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
                <Skeleton className="h-20 w-full mb-8" />
                <Skeleton className="h-12 w-40" />
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  // Redirect if product not found
  if (!product) {
    return <Navigate to="/products" replace />;
  }

  const productImage = product.image
    ? urlFor(product.image).width(800).url()
    : "/placeholder.png";

  // Convert details array to display format
  const detailsArray = product.details || [];

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-muted py-4">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            {" / "}
            <Link to={`/product-category/${product.categorySlug}`} className="hover:text-primary">
              {product.category}
            </Link>
            {" / "}
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Image */}
            <div className="bg-muted rounded-lg overflow-hidden">
              <img
                src={productImage}
                alt={product.name}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-heading mb-4">
                {product.name}
              </h1>

              {detailsArray.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-3">Products Details:</h2>
                  <ul className="space-y-2">
                    {detailsArray.map((detail, index) => (
                      <li key={index} className="flex text-sm">
                        <span className="font-medium min-w-[160px]">{detail.key}:</span>
                        <span className="text-muted-foreground">{detail.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.description && (
                <p className="text-muted-foreground mb-8 font-medium">
                  {product.description}
                </p>
              )}

              <Button 
                size="lg" 
                className="bg-primary hover:bg-lime-hover text-primary-foreground"
                onClick={() => navigate('/contact-us', { 
                  state: { 
                    product: { 
                      name: product.name, 
                      category: product.category,
                      productCode: product.productCode,
                      slug: product.slug 
                    } 
                  } 
                })}
              >
                Product Inquiry
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {!relatedLoading && relatedProducts && relatedProducts.length > 0 && (
        <section className="py-12 md:py-16 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold font-heading text-center mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default ProductDetail;
