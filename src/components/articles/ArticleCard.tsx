import { Link } from "react-router-dom";
import { Article } from "@/data/articles";

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <article className="bg-card rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 card-hover">
      <div className="aspect-video overflow-hidden bg-muted">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold font-heading mb-2 line-clamp-2">
          <Link to={`/article/${article.slug}`} className="hover:text-primary transition-colors">
            {article.title}
          </Link>
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <Link 
            to={`/article/${article.slug}`}
            className="text-primary font-semibold text-sm hover:underline"
          >
            Read More »
          </Link>
          <span className="text-muted-foreground text-xs">{article.date}</span>
        </div>
      </div>
    </article>
  );
};
