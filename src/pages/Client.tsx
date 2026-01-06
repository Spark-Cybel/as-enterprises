import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/layout/PageHero";
import { useClients } from "@/hooks/useSanityData";
import { urlFor } from "@/sanity/client";
import { Skeleton } from "@/components/ui/skeleton";

const Client = () => {
  const { data: clientCategories, isLoading } = useClients();

  // Filter out empty categories
  const nonEmptyCategories = clientCategories?.filter(
    (category) => category.clients && category.clients.length > 0
  ) || [];

  return (
    <Layout>
      <PageHero 
        title="Clients" 
        backgroundImage="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=80"
      />
      
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="space-y-16">
              {[...Array(3)].map((_, categoryIndex) => (
                <div key={categoryIndex}>
                  <div className="flex items-center gap-4 mb-8">
                    <Skeleton className="h-8 w-40" />
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-24 rounded-lg" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : nonEmptyCategories.length > 0 ? (
            <div className="space-y-16">
              {nonEmptyCategories.map((category) => (
                <div key={category._id}>
                  <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-xl md:text-2xl font-semibold font-heading text-foreground">
                      {category.name}
                    </h2>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {category.clients.map((client) => {
                      const logoUrl = client.logo
                        ? urlFor(client.logo).width(200).url()
                        : null;
                      
                      return (
                        <div 
                          key={client._id}
                          className="bg-card rounded-lg p-6 flex items-center justify-center shadow-card hover:shadow-card-hover transition-all duration-300"
                        >
                          <div className="text-center">
                            {logoUrl ? (
                              <div className="h-16 flex items-center justify-center mb-2">
                                <img
                                  src={logoUrl}
                                  alt={client.name}
                                  className="max-h-full max-w-full object-contain"
                                />
                              </div>
                            ) : (
                              <div className="h-16 flex items-center justify-center mb-2">
                                <span className="text-lg font-semibold text-muted-foreground">
                                  {client.name}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No clients available at the moment.</p>
              <p className="text-muted-foreground text-sm mt-2">Please check back later.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Client;
