import { useParams, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/layout/PageHero";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { Pagination } from "@/components/common/Pagination";
import { getArticlesByCategory } from "@/data/articles";
import { getCategoryBySlug } from "@/data/products";

const ARTICLES_PER_PAGE = 6;

const Category = () => {
  const { category, page } = useParams<{ category: string; page?: string }>();
  const currentPage = page ? parseInt(page) : 1;

  const categoryData = category ? getCategoryBySlug(category) : undefined;
  const allArticles = category ? getArticlesByCategory(category) : [];

  if (!categoryData && allArticles.length === 0) {
    return <Navigate to="/" replace />;
  }

  const totalPages = Math.ceil(allArticles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const paginatedArticles = allArticles.slice(startIndex, startIndex + ARTICLES_PER_PAGE);

  const categoryName = categoryData?.name || category?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || '';

  return (
    <Layout>
      <PageHero 
        title={`Category: ${categoryName}`}
        backgroundImage={categoryData?.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"}
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {paginatedArticles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                basePath={`/category/${category}`}
              />
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No articles found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Category;
