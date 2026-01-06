import { Link } from "react-router-dom";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export const Pagination = ({ currentPage, totalPages, basePath }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center gap-2 mt-10">
      {currentPage > 1 && (
        <Link
          to={currentPage === 2 ? basePath : `${basePath}/page/${currentPage - 1}`}
          className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          « Previous
        </Link>
      )}
      
      {pages.map((page) => (
        <Link
          key={page}
          to={page === 1 ? basePath : `${basePath}/page/${page}`}
          className={`px-3 py-1 rounded-md transition-colors ${
            currentPage === page
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          {page}
        </Link>
      ))}
      
      {currentPage < totalPages && (
        <Link
          to={`${basePath}/page/${currentPage + 1}`}
          className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          Next »
        </Link>
      )}
    </nav>
  );
};
