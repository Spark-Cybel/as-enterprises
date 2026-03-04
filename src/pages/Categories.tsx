import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/layout/PageHero";
import { useCategories } from "@/hooks/useSanityData";
import { urlFor } from "@/sanity/client";
import { Skeleton } from "@/components/ui/skeleton";

const Categories = () => {
  const { data: categories, isLoading } = useCategories();

  return (
    <Layout>
      <PageHero
        title="Product Categories"
        backgroundImage="https://images.unsplash.com/photo-1563453392212-326f5e854473?w=1920&q=80"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-heading text-foreground">
              Browse Our Categories
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Explore our comprehensive range of cleaning and hygiene products
              designed for commercial and residential use.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-lg overflow-hidden">
                  <Skeleton className="aspect-[4/3]" />
                </div>
              ))}
            </div>
          ) : categories && categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => {
                const imageUrl = category.image
                  ? urlFor(category.image).width(800).height(600).url()
                  : "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&q=80";

                return (
                  <Link
                    key={category._id}
                    to={`/product-category/${category.slug}`}
                    className="group relative overflow-hidden rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-lg md:text-xl font-semibold text-secondary-foreground font-heading group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-secondary-foreground/70 text-sm mt-2 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No categories available at the moment.
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                Please check back later.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Categories;
